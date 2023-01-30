export default {
  source: {
    hash: "0xbb689fede710d1f551c59ab396a4f1eb68a30ca80f6ab19dc33824f354e3d58d",
    language: "ink! 4.0.0-alpha.3",
    compiler: "rustc 1.66.1",
    build_info: {
      build_mode: "Release",
      cargo_contract_version: "2.0.0-alpha.5",
      rust_toolchain: "stable-x86_64-unknown-linux-gnu",
      wasm_opt_settings: {
        keep_debug_symbols: false,
        optimization_passes: "Z",
      },
    },
  },
  contract: {
    name: "rubeus",
    version: "0.1.0",
    authors: ["[Anton Shramko] <[antonshramko@yandex.ru]>"],
  },
  spec: {
    constructors: [
      {
        args: [
          {
            label: "owner",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: ["You can set a contract owner while deploying the contract"],
        label: "new",
        payable: false,
        selector: "0x9bae9d5e",
      },
      {
        args: [],
        docs: ["A contract publisher is the owner by default"],
        label: "default",
        payable: false,
        selector: "0xed4b9d1b",
      },
    ],
    docs: [],
    events: [],
    messages: [
      {
        args: [
          {
            label: "payload",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
          {
            label: "group",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
          {
            label: "id",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
        ],
        docs: [
          "Method for add new credential, with common payload. Note: a unique id is also required as a parameter, taking into runtime specifics.",
        ],
        label: "add_credential",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["Result"],
          type: 8,
        },
        selector: "0x2b0cff89",
      },
      {
        args: [
          {
            label: "id",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
          {
            label: "payload",
            type: {
              displayName: ["Option"],
              type: 11,
            },
          },
          {
            label: "group",
            type: {
              displayName: ["Option"],
              type: 11,
            },
          },
        ],
        docs: [
          "Method for update for credential, you can update the payload or the group, or both.",
        ],
        label: "update_credential",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["Result"],
          type: 8,
        },
        selector: "0x52cacc31",
      },
      {
        args: [
          {
            label: "id",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
        ],
        docs: ["Method for delete saved credential by id"],
        label: "delete_credential",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["Result"],
          type: 8,
        },
        selector: "0xd6793922",
      },
      {
        args: [],
        docs: ["List of all saved credentials by caller"],
        label: "get_credentials",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["Vec"],
          type: 3,
        },
        selector: "0x483b50c7",
      },
      {
        args: [
          {
            label: "group",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
        ],
        docs: ["List of all saved credentials by group and caller"],
        label: "get_credentials_by_group",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["Vec"],
          type: 3,
        },
        selector: "0xc4dcecac",
      },
      {
        args: [
          {
            label: "payload",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
          {
            label: "id",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
        ],
        docs: [
          "Method for add new note, with common payload. Note: a unique id is also required as a parameter, taking into runtime specifics.",
        ],
        label: "add_note",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["Result"],
          type: 8,
        },
        selector: "0x3493b4f2",
      },
      {
        args: [
          {
            label: "id",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
          {
            label: "payload",
            type: {
              displayName: ["Option"],
              type: 11,
            },
          },
        ],
        docs: [
          "Method for update for note, you can update the payload or the group, or both.",
        ],
        label: "update_note",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["Result"],
          type: 8,
        },
        selector: "0xdd54a5dc",
      },
      {
        args: [
          {
            label: "id",
            type: {
              displayName: ["String"],
              type: 5,
            },
          },
        ],
        docs: ["Method for delete saved note by id"],
        label: "delete_note",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["Result"],
          type: 8,
        },
        selector: "0xdd461fe1",
      },
      {
        args: [],
        docs: ["List of all saved notes by caller"],
        label: "get_notes",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["Vec"],
          type: 6,
        },
        selector: "0xbc552132",
      },
      {
        args: [
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: ["Transfer contract ownership to another user"],
        label: "transfer_ownership",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["Result"],
          type: 8,
        },
        selector: "0x107e33ea",
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
                  key: "0x00000000",
                  ty: 0,
                },
              },
              name: "owner",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0x9f0c1f85",
                      ty: 3,
                    },
                  },
                  root_key: "0x9f0c1f85",
                },
              },
              name: "credentials",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0xd62b821a",
                      ty: 6,
                    },
                  },
                  root_key: "0xd62b821a",
                },
              },
              name: "notes",
            },
          ],
          name: "Rubeus",
        },
      },
      root_key: "0x00000000",
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
                typeName: "[u8; 32]",
              },
            ],
          },
        },
        path: ["ink_primitives", "types", "AccountId"],
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
          primitive: "u8",
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
                name: "payload",
                type: 5,
                typeName: "String",
              },
              {
                name: "group",
                type: 5,
                typeName: "String",
              },
              {
                name: "id",
                type: 5,
                typeName: "String",
              },
            ],
          },
        },
        path: ["rubeus", "rubeus", "Credential"],
      },
    },
    {
      id: 5,
      type: {
        def: {
          primitive: "str",
        },
      },
    },
    {
      id: 6,
      type: {
        def: {
          sequence: {
            type: 7,
          },
        },
      },
    },
    {
      id: 7,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: "payload",
                type: 5,
                typeName: "String",
              },
              {
                name: "id",
                type: 5,
                typeName: "String",
              },
            ],
          },
        },
        path: ["rubeus", "rubeus", "Note"],
      },
    },
    {
      id: 8,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 10,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 9,
          },
          {
            name: "E",
            type: 10,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 9,
      type: {
        def: {
          primitive: "bool",
        },
      },
    },
    {
      id: 10,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "AccessOwner",
              },
              {
                index: 1,
                name: "NotFound",
              },
              {
                index: 2,
                name: "TransferFailed",
              },
              {
                index: 3,
                name: "UniqueIdRequired",
              },
            ],
          },
        },
        path: ["rubeus", "rubeus", "Error"],
      },
    },
    {
      id: 11,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "None",
              },
              {
                fields: [
                  {
                    type: 5,
                  },
                ],
                index: 1,
                name: "Some",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 5,
          },
        ],
        path: ["Option"],
      },
    },
  ],
  version: "4",
};
