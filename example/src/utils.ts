import { ApiBase, SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult, Signer } from "@polkadot/types/types";
import { Contract } from "@polkadot/api-contract/base";
import { KeyringPair } from "@polkadot/keyring/types";
import Keyring from "@polkadot/keyring";
import * as BN from "bn.js";

export const cryptoKeyring = new Keyring({ type: "sr25519" });

export const waitExtrinsic = (
  api: ApiBase<"promise">,
  extrinsic: SubmittableExtrinsic<"promise", ISubmittableResult>,
  signer: KeyringPair | [string, Signer],
  waitStatus?: string[]
): Promise<ISubmittableResult> =>
  new Promise(async (resolve, reject) => {
    const args: any = Array.isArray(signer)
      ? [signer[0], { signer: signer[1] }]
      : [signer, {}];

    const unsubscribe = await extrinsic.signAndSend(args[0], args[1], (res) => {
      const defaultStatusMatch = res.status.isInBlock || res.status.isFinalized;
      const matchedStatus = waitStatus
        ? !waitStatus.map((key) => res.status[key]).includes(false)
        : defaultStatusMatch;

      if (matchedStatus) {
        unsubscribe();

        if (res.dispatchError) {
          let error;
          if (res.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(
              res.dispatchError.asModule
            );
            const { docs, name, section } = decoded;

            error = `${section}.${name}: ${docs.join(" ")}`;
          } else {
            error = res.dispatchError.toString();
          }

          reject(error);
        } else {
          resolve(res);
        }
      }
    });
  });

export const execContractCallWithResult = async (
  contract: Contract<"promise">,
  signer: KeyringPair | [string, Signer],
  method: string,
  ...args: unknown[]
) => {
  const address = Array.isArray(signer) ? signer[0] : signer.address;

  // Estimate with ~expected value
  const query = (await contract.query[method](
    address,
    { gasLimit: -1 },
    ...args
  )) as any;

  if (query.result.isOk) {
    const data = query.output.toJSON();

    if (data.ok) {
      // const gasLimit = getBalance(10, BalanceGrade.Milli)
      //   .add(new BN(query.gasConsumed))
      //   .toNumber();

      const gasLimit = -1;
      const extrinsic = contract.tx[method]({ gasLimit }, ...args);

      await waitExtrinsic(contract.api, extrinsic, signer);
      return data.ok;
    } else {
      const error = new Error(`Error '${data.err}'`) as any;
      error.data = data.err;
      throw error;
    }
  } else {
    throw query.result.asErr().toJSON();
  }
};

export function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime(); //Timestamp

  let d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export enum BalanceGrade {
  Pico = 1,
  Nano = 1_000,
  Micro = 1_000_000,
  Milli = 1_000_000_000,
  Unit = 1_000_000_000_000,
  Kilo = 1_000_000_000_000_000,
  Mill = 1_000_000_000_000_000_000,
}

export const getBalance = (amount: number, grade: BalanceGrade): BN => {
  const number = new BN(amount);
  return number.mul(new BN(grade));
};

export const fmtBalance = (balance: BN, grade: BalanceGrade): BN => {
  return balance.div(new BN(grade));
};
