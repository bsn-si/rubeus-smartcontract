export default {
  source: {
    hash: '0x62f694d9430b43982c4065072a05f09a032b6faca9e1be31e85600080edfd339',
    language: 'ink! 4.0.0-alpha.3',
    compiler: 'rustc 1.64.0',
    build_info: {
      build_mode: 'Release',
      cargo_contract_version: '2.0.0-alpha.5',
      rust_toolchain: 'stable-x86_64-unknown-linux-gnu',
      wasm_opt_settings: {
        keep_debug_symbols: false,
        optimization_passes: 'Z',
      },
    },
  },
  contract: {
    name: 'rubeus',
    version: '0.1.0',
    authors: ['[Anton Shramko] <[antonshramko@yandex.ru]>'],
  },
  spec: {
    constructors: [
      {
        args: [
          {
            label: 'owner',
            type: {
              displayName: ['AccountId'],
              type: 0,
            },
          },
        ],
        docs: ['You can set a contract owner while deploying the contract'],
        label: 'new',
        payable: false,
        selector: '0x9bae9d5e',
      },
      {
        args: [],
        docs: ['Owner is the contract publisher by default'],
        label: 'default',
        payable: false,
        selector: '0xed4b9d1b',
      },
    ],
    docs: [],
    events: [],
    messages: [
      {
        args: [
          {
            label: 'payload',
            type: {
              displayName: ['String'],
              type: 5,
            },
          },
          {
            label: 'group',
            type: {
              displayName: ['String'],
              type: 5,
            },
          },
          {
            label: 'id',
            type: {
              displayName: ['String'],
              type: 5,
            },
          },
        ],
        docs: [],
        label: 'add_credential',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['Result'],
          type: 6,
        },
        selector: '0x2b0cff89',
      },
      {
        args: [
          {
            label: 'id',
            type: {
              displayName: ['String'],
              type: 5,
            },
          },
          {
            label: 'payload',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'group',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'update_credential',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['Result'],
          type: 6,
        },
        selector: '0x52cacc31',
      },
      {
        args: [
          {
            label: 'id',
            type: {
              displayName: ['String'],
              type: 5,
            },
          },
        ],
        docs: [],
        label: 'delete_credential',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['Result'],
          type: 6,
        },
        selector: '0xd6793922',
      },
      {
        args: [
          {
            label: 'account',
            type: {
              displayName: ['AccountId'],
              type: 0,
            },
          },
        ],
        docs: ['Transfer contract ownership to another user'],
        label: 'transfer_ownership',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['Result'],
          type: 6,
        },
        selector: '0x107e33ea',
      },
      {
        args: [],
        docs: ['Return all saved crendentials by caller'],
        label: 'get_credentials',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['Vec'],
          type: 3,
        },
        selector: '0x483b50c7',
      },
      {
        args: [
          {
            label: 'group',
            type: {
              displayName: ['String'],
              type: 5,
            },
          },
        ],
        docs: [],
        label: 'get_credentials_by_group',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['Vec'],
          type: 3,
        },
        selector: '0xc4dcecac',
      },
    ],
  },
  storage: {
    root: {
      layout: {
        struct: {
          fields: [
            {
              layout: {
                leaf: {
                  key: '0x00000000',
                  ty: 0,
                },
              },
              name: 'owner',
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: '0xf71f5020',
                      ty: 3,
                    },
                  },
                  root_key: '0xf71f5020',
                },
              },
              name: 'accounts',
            },
          ],
          name: 'Rubeus',
        },
      },
      root_key: '0x00000000',
    },
  },
  types: [
    {
      id: 0,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 1,
                typeName: '[u8; 32]',
              },
            ],
          },
        },
        path: ['ink_primitives', 'types', 'AccountId'],
      },
    },
    {
      id: 1,
      type: {
        def: {
          array: {
            len: 32,
            type: 2,
          },
        },
      },
    },
    {
      id: 2,
      type: {
        def: {
          primitive: 'u8',
        },
      },
    },
    {
      id: 3,
      type: {
        def: {
          sequence: {
            type: 4,
          },
        },
      },
    },
    {
      id: 4,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'payload',
                type: 5,
                typeName: 'String',
              },
              {
                name: 'group',
                type: 5,
                typeName: 'String',
              },
              {
                name: 'id',
                type: 5,
                typeName: 'String',
              },
            ],
          },
        },
        path: ['rubeus', 'rubeus', 'Credential'],
      },
    },
    {
      id: 5,
      type: {
        def: {
          primitive: 'str',
        },
      },
    },
    {
      id: 6,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 7,
          },
          {
            name: 'E',
            type: 8,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 7,
      type: {
        def: {
          primitive: 'bool',
        },
      },
    },
    {
      id: 8,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'AccessOwner',
              },
              {
                index: 1,
                name: 'NotFound',
              },
              {
                index: 2,
                name: 'TransferFailed',
              },
              {
                index: 3,
                name: 'UniqueIdRequired',
              },
            ],
          },
        },
        path: ['rubeus', 'rubeus', 'Error'],
      },
    },
    {
      id: 9,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 5,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 5,
          },
        ],
        path: ['Option'],
      },
    },
  ],
  version: '4',
}
