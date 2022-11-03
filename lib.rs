//! Rubeus - encrypted credentials storage

#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod rubeus {
    use scale_info::prelude::{string::String, vec::Vec};
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct Rubeus {
        // A contract publisher is the smart-contract owner by default
        pub owner: AccountId,
        // Accounts with password groups
        pub accounts: Mapping<AccountId, Vec<Credential>>,
    }

    /// Credential struct
    #[derive(Debug, Default, Clone, PartialEq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Credential {
        pub payload: String,
        pub group: String,
        pub id: String,
    }

    impl From<scale::Error> for Credential {
        fn from(_: scale::Error) -> Self {
            panic!("encountered unexpected invalid SCALE encoding")
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    /// Error types
    pub enum Error {
        /// Caller is not the owner of the contract
        AccessOwner,
        /// Credential(s) not found
        NotFound,
        /// Transfer Errors
        TransferFailed,
        // Credential must have unique id
        UniqueIdRequired,
    }

    impl Rubeus {
        /// You can set a contract owner while deploying the contract
        #[ink(constructor)]
        pub fn new(owner: AccountId) -> Self {
            Self {
                accounts: Mapping::new(),
                owner,
            }
        }

        /// A contract publisher is the owner by default
        #[ink(constructor)]
        pub fn default() -> Self {
            Self {
                owner: Self::env().caller(),
                accounts: Mapping::new(),
            }
        }

        // Add new credential
        #[ink(message)]
        pub fn add_credential(
            &mut self,
            payload: String,
            group: String,
            id: String,
        ) -> Result<bool, Error> {
            let caller = Self::env().caller();

            let credential = Credential {
                payload,
                group,
                id: id.clone(),
            };

            let mut credentials = self.accounts.get(caller).unwrap_or_default();

            credentials
                .iter()
                .find(|c| c.id == id)
                .is_none()
                .then(|| {
                    credentials.push(credential);
                    self.accounts.insert(caller, &credentials);
                    true
                })
                .ok_or(Error::UniqueIdRequired)
        }

        // Update encrypted payload for credential
        #[ink(message)]
        pub fn update_credential(
            &mut self,
            id: String,
            payload: Option<String>,
            group: Option<String>,
        ) -> Result<bool, Error> {
            let caller = Self::env().caller();

            if !self.accounts.contains(Self::env().caller()) {
                Err(Error::NotFound)
            } else {
                let mut credentials = self.accounts.get(caller).ok_or(Error::NotFound)?;

                let index = credentials
                    .iter()
                    .position(|c| c.id == id)
                    .ok_or(Error::NotFound)?;

                let credential = credentials.get_mut(index).ok_or(Error::NotFound)?;

                if let Some(_payload) = payload {
                    credential.payload = _payload;
                }

                if let Some(_group) = group {
                    credential.group = _group;
                }

                self.accounts.insert(caller, &credentials);
                Ok(true)
            }
        }

        // Delete saved credential by id
        #[ink(message)]
        pub fn delete_credential(&mut self, id: String) -> Result<bool, Error> {
            let caller = Self::env().caller();

            if !self.accounts.contains(Self::env().caller()) {
                Err(Error::NotFound)
            } else {
                let mut credentials = self.accounts.get(caller).ok_or(Error::NotFound)?;

                let index = credentials
                    .iter()
                    .position(|c| c.id == id)
                    .ok_or(Error::NotFound)?;

                credentials.remove(index);

                self.accounts.insert(caller, &credentials);
                Ok(true)
            }
        }

        /// Transfer contract ownership to another user
        #[ink(message)]
        pub fn transfer_ownership(&mut self, account: AccountId) -> Result<bool, Error> {
            (Self::env().caller() == self.owner)
                .then(|| {
                    self.owner = account;
                    true
                })
                .ok_or(Error::AccessOwner)
        }

        /// Return all saved crendentials by caller
        #[ink(message)]
        pub fn get_credentials(&self) -> Vec<Credential> {
            self.accounts
                .get(Self::env().caller())
                .unwrap_or_default()
        }

        // Return all saved credentials by group
        #[ink(message)]
        pub fn get_credentials_by_group(&self, group: String) -> Vec<Credential> {
            let credentials = self
                .accounts
                .get(Self::env().caller())
                .unwrap_or_default();

            let filtered = credentials
                .into_iter()
                .filter(|credential| credential.group.contains(&*group))
                .collect::<Vec<Credential>>();

            filtered
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn check_crud_credential() {
            let accounts = default_accounts();

            // setup contract
            let mut contract = create_contract(1000);

            // setup sender, (by default `alice` also publisher and can add coupons)
            set_sender(accounts.alice);
            assert_eq!(contract.owner, accounts.alice);

            // add credential by caller account
            let credential = Credential {
                group: "group".into(),
                payload: "pass".into(),
                id: "1".into(),
            };

            assert_eq!(
                contract.add_credential(
                    credential.payload.clone(),
                    credential.group.clone(),
                    credential.id.clone()
                ),
                Ok(true)
            );

            assert_eq!(
                contract.add_credential(
                    credential.payload.clone(),
                    credential.group.clone(),
                    credential.id.clone()
                ),
                Err(Error::UniqueIdRequired)
            );

            assert_eq!(
                contract.accounts.get(accounts.alice).unwrap()[0],
                credential
            );

            // update credential
            let updated_credential = Credential {
                group: "group next".into(),
                payload: "pass next".into(),
                id: "1".into(),
            };

            assert_eq!(
                contract.update_credential(
                    credential.id.clone(),
                    Some(updated_credential.payload.clone()),
                    Some(updated_credential.group.clone()),
                ),
                Ok(true)
            );

            assert_eq!(
                contract.update_credential(
                    "not_found".into(),
                    Some(updated_credential.payload.clone()),
                    Some(updated_credential.group.clone()),
                ),
                Err(Error::NotFound)
            );

            assert_eq!(
                contract.accounts.get(accounts.alice).unwrap()[0],
                updated_credential
            );

            assert_eq!(
                contract.delete_credential("100".into()),
                Err(Error::NotFound)
            );

            assert_eq!(contract.delete_credential("1".into()), Ok(true));

            assert_eq!(contract.accounts.get(accounts.alice).unwrap(), vec![]);
        }

        fn create_contract(initial_balance: Balance) -> Rubeus {
            let accounts = default_accounts();

            set_sender(accounts.alice);
            set_balance(contract_id(), initial_balance);

            // Alice is the publisher and owner by default
            Rubeus::default()
        }

        fn contract_id() -> AccountId {
            ink::env::test::callee::<ink::env::DefaultEnvironment>()
        }

        fn set_sender(sender: AccountId) {
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(sender);
        }

        fn default_accounts() -> ink::env::test::DefaultAccounts<ink::env::DefaultEnvironment> {
            ink::env::test::default_accounts::<ink::env::DefaultEnvironment>()
        }

        fn set_balance(account_id: AccountId, balance: Balance) {
            ink::env::test::set_account_balance::<ink::env::DefaultEnvironment>(account_id, balance)
        }
    }
}
