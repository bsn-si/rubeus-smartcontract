import { WsProvider, ApiPromise, Keyring } from "@polkadot/api";
import { Contract } from "@polkadot/api-contract/base";
import { KeyringPair } from "@polkadot/keyring/types";
import { hexToU8a, u8aToHex } from "@polkadot/util";
import { GenericAccountId } from "@polkadot/types";
import * as JSChaCha20 from "js-chacha20";
import * as fs from "fs/promises";
import * as path from "path";
import * as pako from "pako";

import { execContractCallWithResult, generateUUID } from "./utils";
import { uploadContract } from "./upload";

const RPC_URL = "ws://127.0.0.1:9944";

export const delay = (ms: number) =>
  new Promise((resolve: any) => setTimeout(() => resolve(), ms));

async function getProvider(url: string) {
  const provider = new WsProvider(url, false);
  await provider.connect();
  await delay(100);

  if (!provider.isConnected) {
    throw new Error(`Connect to '${url}' failed, try again later`);
  }

  return provider;
}

async function connect(url: string) {
  const provider = await getProvider(url);
  const client = await ApiPromise.create({ provider });

  const [chain, nodeName, nodeVersion] = await Promise.all([
    client.rpc.system.chain(),
    client.rpc.system.name(),
    client.rpc.system.version(),
  ]);

  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );

  return client;
}

// encrypt credential payload object with chacha20 to hex string
function encryptToHex(
  address: GenericAccountId,
  key: string,
  payload: Record<string, any>
) {
  // convert js string to binary array
  const message = new TextEncoder().encode(JSON.stringify(payload));
  // make nonce from target contract address
  const nonce = address.toU8a().slice(0, 12);
  // encrypt binary payload with nonce
  const encrypted = new JSChaCha20(hexToU8a(key), nonce).encrypt(message);
  // zip data 
  const compressed = pako.deflate(encrypted);
  // convert to hex string
  const hex = u8aToHex(compressed, undefined, false);

  return hex;
}

// decrypt credential payload object encrypted with chacha20 to object
function decryptFromHex(
  address: GenericAccountId,
  key: string,
  payload: string
) {
  // make nonce from target contract address
  const nonce = address.toU8a().slice(0, 12);
  // convert hex to binary array
  const bytes = hexToU8a(payload);
  // decompress data
  const decompressed = pako.inflate(bytes);
  // decrypt binary array to string bytes
  const decrypted = new JSChaCha20(hexToU8a(key), nonce).decrypt(decompressed);
  // decode string binary array to native string
  const message = new TextDecoder().decode(decrypted);
  // parse json payload
  const parsed = JSON.parse(message);

  return parsed;
}

// get all credentials with decrypted payload data
async function getCredentials(
  contract: Contract<"promise">,
  signer: KeyringPair,
  privateKey: string // same as signer
) {
  const list = await contract.query
    .getCredentials(signer.address, { gasLimit: -1 })
    .then((response) => response.output.toJSON() as any)
    .then((data) =>
      data.map((credential) => {
        credential.decrypted = decryptFromHex(
          contract.address,
          privateKey,
          credential.payload
        );

        return credential;
      })
    );

  return list;
}

// get all credentials by group with decrypted payload data
async function getCredentialsByGroup(
  contract: Contract<"promise">,
  signer: KeyringPair,
  privateKey: string, // same as signer
  group: string
) {
  const list = await contract.query
    .getCredentialsByGroup(signer.address, { gasLimit: -1 }, group)
    .then((response) => response.output.toJSON() as any)
    .then((data) =>
      data.map((credential) => {
        credential.decrypted = decryptFromHex(
          contract.address,
          privateKey,
          credential.payload
        );

        return credential;
      })
    );

  return list;
}

// add new credential with chacha20 encryption to contract
async function addCredential(
  contract: Contract<"promise">,
  signer: KeyringPair,
  privateKey: string, // same as signer in hex
  group: string,
  payload: any
) {
  // encrypt credential payload by caller private key
  const encrypted = encryptToHex(contract.address, privateKey, payload);
  // generate unique id for credential
  const id = generateUUID();

  const response = await execContractCallWithResult(
    contract,
    signer,
    "addCredential",
    encrypted,
    group,
    id
  );

  return {
    payload: encrypted,
    response,
    group,
    id,
  };
}

async function updateCredential(
  contract: Contract<"promise">,
  signer: KeyringPair,
  privateKey: string, // same as signer in hex
  id: string,
  group?: string,
  payload?: any
) {
  const _payload = payload
    ? encryptToHex(contract.address, privateKey, payload)
    : undefined;

  const _group = group ? group : undefined;

  const response = await execContractCallWithResult(
    contract,
    signer,
    "updateCredential",
    id,
    _payload,
    _group
  );

  return response;
}

async function main() {
  const keyring = new Keyring({ type: "sr25519" });
  const api = await connect(RPC_URL);

  // '//Alice' private key
  const privateKey =
    "0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a";

  const signer = keyring.addFromUri(privateKey);

  // Upload & Instantiate
  const wasm = await fs.readFile(path.join(__dirname, "rubeus.wasm"));
  const contract = await uploadContract(api, signer, wasm);
  console.log("Contract upload & Instantiated: ", contract.address.toHuman());

  // Add new credential to instantiated contract
  const addResponse = await addCredential(
    contract,
    signer,
    privateKey,
    "test",
    {
      host: "https://test.test",
      password: "test",
      login: "test",
    }
  );

  console.log("Credential added: ", addResponse);

  // Load list of credentials
  const credentials = await getCredentials(contract, signer, privateKey);
  console.log("Credentials: ", credentials);

  // Load list of credentials by group
  const credentialsByGroup = await getCredentialsByGroup(
    contract,
    signer,
    privateKey,
    "test"
  );

  console.log("Credentials By Group 'test': ", credentialsByGroup);
}

main()
  .catch((error) => console.error(error))
  .finally(() => process.exit(0));
