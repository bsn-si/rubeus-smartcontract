<h1 align="center">
    🔑 ✨ Rubeus ✨ 🔐
</h1>

<p align="center">
This is an  <a href="https://github.com/paritytech/ink">Ink!</a> smartcontract implementing credentials storage logic. <br>
With this contract you can create/update/delete your encrypted credentials in a blockchain database. It works with client-side DApp.
</p>

## Design and features
* Contract set-up with owner, set by constructor's argument, or set caller by default.
* After initialization of the contract users can save credentials. All payload need to be encrypted before saving in storage, you can make it from the dapp.
* CRUD operations with credentials.
* Contract own management and transfer ownership.

## How to
### Install Prerequisites
Please follow installation instructions provided [here](https://docs.substrate.io/tutorials/v3/ink-workshop/pt1/#prerequisites).

### Clone this repo
```
git clone https://github.com/bsn-si/rubeus-smartcontract
```

### Compile + Run Tests
```
cd rubeus-smartcontract
cargo test
```

Also you can run an example from the `/example` folder, that is written with polkadot.js and works with client-side encryption.
To run example please follow these steps:

```
cd example/
npm install 
npm run start
```

### Build Contract + metadata
```
cargo contract build
```

### Resolve common errors
You need `wasm` target and `dylint` set.
To install specified toolchain & targets please run:

``` bash
rustup target add wasm32-unknown-unknown
cargo install cargo-dylint
```

In case you get a compilation error during the wasm optimization step, make sure you have [binaryen](https://github.com/WebAssembly/binaryen) installed.

### Deploy on testnet
First setup and start [substrate-contracts-node](https://github.com/paritytech/substrate-contracts-node), go to [Polkadot Portal UI](https://polkadot.js.org/apps/#/contracts) for setting up a test contract.

After creating an instance of the contract on the blockchain you can use a core `owner` from test accounts list like `Alice`.
Next you need to send funds to the contract and then you can call contract's methods from Polkadot Portal UI.

#### Example usage
- Instantiate new contract with `Alice` owner.
- From Polkadot Portal UI call `addCredential` method, enter any payload with a unique ID - you can generate it or choose any for test from the list
- Call method with `Execute` action on Polkadot Portal UI.
- You can load all your credentials with method `getCredentials`

A short video explaining how to comile the smart-contract:
[![compile_and_instanite](https://user-images.githubusercontent.com/98888366/199804377-519b1651-f2ef-4d3b-b1be-cf9dd634b4c4.png)](https://media.bsn.si/rubeus/compile_and_instantiate_contract.mp4)

## Related repos
[Rubeus browser extension](https://github.com/bsn-si/rubeus-client)

## License

[Apache License 2.0](https://github.com/bsn-si/rubeus-smartcontract/blob/main/LICENSE) © Bela Supernova ([bsn.si](https://bsn.si))
