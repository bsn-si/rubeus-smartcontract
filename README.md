<h1 align="center">
    🔑 ✨ Rubeus ✨ 🔐
</h1>

<p align="center">
This is an  <a href="https://github.com/paritytech/ink">Ink!</a> smartcontract implementing a credential storage logic. <br>
With this contract you can create/update/delete you encrypted credentials in blockchain database. It works with client-side DApp.
</p>

## Design and features
* Contract set-up with owner, set by constructor's argument, or set caller by default.
* After initialization the contract, users can save credentials. All payload need to be encrypted before save in storage, you can make it from dapp.
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

### Build Contract + metadata
```
cargo contract build
```

### Resolve common errors
You may encounter compilation or optimization errors in wasm builds.
Build tested on `nightly-2022-08-08` toolchain, with `rustc 1.64.0 (a55dd71d5 2022-09-19)` version, if you have compilation errors try changing the toolkit and compiler version to the specified one. Also you need `wasm` target and `dylint`. For install specified toolchain & targets run:

``` bash
rustup toolchain install nightly-2022-08-08
rustup target add wasm32-unknown-unknown
cargo install cargo-dylint
```

In case you get a compilation error during the wasm optimization step, make sure you have [binaryen](https://github.com/WebAssembly/binaryen) installed.

### Deploy on testnet
First setup and start [substrate-contracts-node](https://github.com/paritytech/substrate-contracts-node), go to [Polkadot Portal UI](https://polkadot.js.org/apps/#/contracts) for setting up a test contract.

After creating an instance of the contract on the blockchain you can use a core `owner` from test accounts list like `Alice`.
After that you need to send funds to the contract. Now you can call contract's methods from Polkadot Portal UI.

#### Example usage
- Instantiate new contract with `Alice` owner.
- From Polkadot Portal UI call `addCredential` method, enter any payload, but id must be unique - generate it or choose any for test
- Call method with `Execute` action on Polkadot Portal UI.
- You can load all you credentials with method `getCredentials`

## License

[Apache License 2.0](https://github.com/bsn-si/rubeus-smartcontract/blob/main/LICENSE) © Bela Supernova ([bsn.si](https://bsn.si))
