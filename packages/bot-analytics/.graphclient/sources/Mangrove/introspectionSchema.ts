// @ts-nocheck
import { buildASTSchema } from "graphql";

const schemaAST = {
  kind: "Document",
  definitions: [
    {
      kind: "SchemaDefinition",
      operationTypes: [
        {
          kind: "OperationTypeDefinition",
          operation: "query",
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Query",
            },
          },
        },
        {
          kind: "OperationTypeDefinition",
          operation: "subscription",
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Subscription",
            },
          },
        },
      ],
      directives: [],
    },
    {
      kind: "DirectiveDefinition",
      description: {
        kind: "StringValue",
        value:
          "Marks the GraphQL type as indexable entity.  Each type that should be an entity is required to be annotated with this directive.",
      },
      name: {
        kind: "Name",
        value: "entity",
      },
      arguments: [],
      repeatable: false,
      locations: [
        {
          kind: "Name",
          value: "OBJECT",
        },
      ],
    },
    {
      kind: "DirectiveDefinition",
      description: {
        kind: "StringValue",
        value: "Defined a Subgraph ID for an object type",
      },
      name: {
        kind: "Name",
        value: "subgraphId",
      },
      arguments: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
      ],
      repeatable: false,
      locations: [
        {
          kind: "Name",
          value: "OBJECT",
        },
      ],
    },
    {
      kind: "DirectiveDefinition",
      description: {
        kind: "StringValue",
        value:
          "creates a virtual field on the entity that may be queried but cannot be set manually through the mappings API.",
      },
      name: {
        kind: "Name",
        value: "derivedFrom",
      },
      arguments: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "field",
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
      ],
      repeatable: false,
      locations: [
        {
          kind: "Name",
          value: "FIELD_DEFINITION",
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Account",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "address",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "volumes",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "AccountVolumeByPair_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "AccountVolumeByPair_filter",
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "AccountVolumeByPair",
                  },
                },
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "AccountVolumeByPair",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "account",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Account",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "updatedDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "token0",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "token1",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "token0Sent",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "token0Received",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "token1Sent",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "token1Received",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "AccountVolumeByPair_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "account_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "updatedDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "updatedDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "updatedDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "updatedDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "updatedDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "updatedDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "updatedDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "updatedDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Sent",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Sent_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Sent_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Sent_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Sent_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Sent_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Sent_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Sent_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Received",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Received_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Received_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Received_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Received_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Received_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Received_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token0Received_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Sent",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Sent_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Sent_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Sent_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Sent_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Sent_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Sent_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Sent_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Received",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Received_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Received_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Received_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Received_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Received_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Received_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token1Received_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "AccountVolumeByPair_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "AccountVolumeByPair_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "AccountVolumeByPair_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "account",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "account__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "account__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "account__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "account__latestInteractionDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "updatedDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "token0",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "token1",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "token0Sent",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "token0Received",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "token1Sent",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "token1Received",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Account_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "volumes_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "AccountVolumeByPair_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Account_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Account_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "Account_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "latestInteractionDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "volumes",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ScalarTypeDefinition",
      name: {
        kind: "Name",
        value: "BigDecimal",
      },
      directives: [],
    },
    {
      kind: "ScalarTypeDefinition",
      name: {
        kind: "Name",
        value: "BigInt",
      },
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "BlockChangedFilter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "number_gte",
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Int",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Block_height",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "hash",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "number",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Int",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "number_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Int",
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ScalarTypeDefinition",
      name: {
        kind: "Name",
        value: "Bytes",
      },
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Kandel",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "seeder",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "address",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "base",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "quote",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "deployer",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Account",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "admin",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Account",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "reserveId",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "router",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "depositedBase",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gasprice",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gasreq",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "spread",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "ratio",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "length",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "offerIndexes",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "offers",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Offer_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Offer_filter",
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Offer",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "depositWithdraws",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelDepositWithdraw_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelDepositWithdraw_filter",
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "KandelDepositWithdraw",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "parameters",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelParameters_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelParameters_filter",
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "KandelParameters",
                  },
                },
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "KandelDepositWithdraw",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "date",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "token",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "amount",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isDeposit",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Kandel",
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "KandelDepositWithdraw_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "date",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "date_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "date_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "date_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "date_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "date_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "date_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "date_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "token_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "amount",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "amount_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "amount_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "amount_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "amount_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "amount_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "amount_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "amount_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isDeposit",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isDeposit_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isDeposit_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isDeposit_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Kandel_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "KandelDepositWithdraw_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "KandelDepositWithdraw_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "KandelDepositWithdraw_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "date",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "token",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "amount",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "isDeposit",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__seeder",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__base",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__quote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__reserveId",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__router",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__depositedBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__depositedQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__gasprice",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__gasreq",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__compoundRateBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__compoundRateQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__spread",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__ratio",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__length",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "KandelParameters",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gasprice",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gasreq",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "spread",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "ratio",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "length",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Kandel",
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "KandelParameters_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Kandel_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "KandelParameters_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "KandelParameters_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "KandelParameters_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "spread",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "ratio",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "length",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__seeder",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__base",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__quote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__reserveId",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__router",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__depositedBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__depositedQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__gasprice",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__gasreq",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__compoundRateBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__compoundRateQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__spread",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__ratio",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__length",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "KandelPopulateRetract",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isRetract",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "offerGives",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Kandel",
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "KandelPopulateRetract_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isRetract",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isRetract_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isRetract_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isRetract_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerGives",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerGives_not",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerGives_contains",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerGives_contains_nocase",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerGives_not_contains",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerGives_not_contains_nocase",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Kandel_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "KandelPopulateRetract_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "KandelPopulateRetract_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "KandelPopulateRetract_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "startLogIndex",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "isRetract",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offerGives",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__seeder",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__base",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__quote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__reserveId",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__router",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__depositedBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__depositedQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__gasprice",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__gasreq",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__compoundRateBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__compoundRateQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__spread",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__ratio",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__length",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Kandel_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "seeder_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "address_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "base_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "quote_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deployer_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "admin_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "router_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedBase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedBase_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedBase_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedBase_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedBase_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedBase_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedBase_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedBase_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "spread_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ratio_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "length_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerIndexes",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerIndexes_not",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerIndexes_contains",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerIndexes_contains_nocase",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerIndexes_not_contains",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerIndexes_not_contains_nocase",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offers_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Offer_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "depositWithdraws_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "KandelDepositWithdraw_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "parameters_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "KandelParameters_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Kandel_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Kandel_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "Kandel_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "seeder",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "base",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "quote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "deployer",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "deployer__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "deployer__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "deployer__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "deployer__latestInteractionDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "admin",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "admin__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "admin__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "admin__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "admin__latestInteractionDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "reserveId",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "router",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "depositedBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "depositedQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "compoundRateQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "spread",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "ratio",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "length",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offerIndexes",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offers",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "depositWithdraws",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "parameters",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "LimitOrder",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "wants",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gives",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "expiryDate",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "fillWants",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "fillOrKill",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "restingOrder",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "realTaker",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "offer",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Offer",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isOpen",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "order",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Order",
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "LimitOrder_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "expiryDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "expiryDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "expiryDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "expiryDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "expiryDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "expiryDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "expiryDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "expiryDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "fillWants",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "fillWants_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "fillWants_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "fillWants_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "fillOrKill",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "fillOrKill_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "fillOrKill_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "fillOrKill_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "restingOrder",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "restingOrder_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "restingOrder_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "restingOrder_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offer_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Offer_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "order_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Order_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "LimitOrder_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "LimitOrder_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "LimitOrder_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "wants",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gives",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "expiryDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "fillWants",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "fillOrKill",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "restingOrder",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "realTaker__latestInteractionDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__latestTransactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__latestLogIndex",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__latestUpdateDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__offerId",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__wants",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__gives",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__gasprice",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__gasreq",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__gasBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__prev",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__isOpen",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__isFailed",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__isFilled",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__isRetracted",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__failedReason",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__posthookFailReason",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__deprovisioned",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__totalGot",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__totalGave",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__prevGives",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offer__prevWants",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "order",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "order__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "order__transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "order__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "order__takerGot",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "order__takerGave",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "order__penalty",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "order__feePaid",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Market",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "active",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gasbase",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Market_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "active",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "active_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "active_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "active_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasbase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasbase_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasbase_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasbase_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasbase_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasbase_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasbase_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasbase_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Market_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Market_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "Market_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "outbound_tkn",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "inbound_tkn",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "active",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gasbase",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Offer",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "offerId",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "wants",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gives",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gasprice",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gasreq",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "gasBase",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "prev",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isOpen",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isFailed",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isFilled",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isRetracted",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "failedReason",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "deprovisioned",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "totalGot",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "totalGave",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "prevGives",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "prevWants",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "market",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Market",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "maker",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Account",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "owner",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Kandel",
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Offer_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerId",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerId_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerId_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerId_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerId_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerId_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerId_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "offerId_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "wants_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gives_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasBase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasBase_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasBase_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasBase_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasBase_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasBase_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasBase_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "gasBase_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prev",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prev_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prev_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prev_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prev_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prev_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prev_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prev_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isFailed",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isFailed_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isFailed_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isFailed_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isFilled",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isFilled_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isFilled_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isFilled_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isRetracted",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isRetracted_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isRetracted_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "isRetracted_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deprovisioned",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deprovisioned_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deprovisioned_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "deprovisioned_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Boolean",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGot",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGot_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGot_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGot_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGot_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGot_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGot_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGot_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGave",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGave_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGave_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGave_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGave_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGave_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGave_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "totalGave_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevGives",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevGives_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevGives_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevGives_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevGives_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevGives_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevGives_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevGives_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevWants",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevWants_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevWants_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevWants_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevWants_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevWants_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevWants_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "prevWants_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Market_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "maker_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "owner_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "kandel_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Kandel_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Offer_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Offer_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "Offer_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "latestTransactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "latestLogIndex",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "latestUpdateDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "offerId",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "wants",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gives",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gasprice",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gasreq",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "gasBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "prev",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "isOpen",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "isFailed",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "isFilled",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "isRetracted",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "failedReason",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "posthookFailReason",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "deprovisioned",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "totalGot",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "totalGave",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "prevGives",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "prevWants",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__outbound_tkn",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__inbound_tkn",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__active",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__gasbase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "maker",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "maker__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "maker__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "maker__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "maker__latestInteractionDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "owner",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "owner__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "owner__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "owner__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "owner__latestInteractionDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__seeder",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__base",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__quote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__reserveId",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__router",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__depositedBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__depositedQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__gasprice",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__gasreq",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__compoundRateBase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__compoundRateQuote",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__spread",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__ratio",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "kandel__length",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Order",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Bytes",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "BigInt",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "taker",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "takerGot",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "takerGave",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "penalty",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "feePaid",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "market",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Market",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "limitOrder",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "LimitOrder",
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      description: {
        kind: "StringValue",
        value: "Defines the order direction, either ascending or descending",
        block: true,
      },
      name: {
        kind: "Name",
        value: "OrderDirection",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "asc",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "desc",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "OrderStack",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "ids",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "last",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Order",
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "OrderStack_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "ids_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "last_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Order_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "OrderStack_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "OrderStack_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "OrderStack_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "ids",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "last",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "last__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "last__transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "last__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "last__takerGot",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "last__takerGave",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "last__penalty",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "last__feePaid",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Order_filter",
      },
      fields: [
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "id_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Bytes",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "taker_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGot",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGot_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGot_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGot_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGot_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGot_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGot_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGot_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGave",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGave_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGave_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGave_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGave_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGave_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGave_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "takerGave_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "penalty",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "penalty_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "penalty_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "penalty_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "penalty_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "penalty_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "penalty_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "penalty_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "feePaid",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "feePaid_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "feePaid_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "feePaid_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "feePaid_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "feePaid_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BigInt",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "feePaid_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "feePaid_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "BigInt",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "market_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Market_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_not",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_gt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_lt",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_gte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_lte",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_not_in",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "String",
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_not_contains",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_not_contains_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_not_starts_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_not_starts_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_not_ends_with",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_not_ends_with_nocase",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder_",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "LimitOrder_filter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          description: {
            kind: "StringValue",
            value: "Filter for the block changed event.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_change_block",
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "BlockChangedFilter",
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "and",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Order_filter",
              },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: {
            kind: "Name",
            value: "or",
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Order_filter",
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "Order_orderBy",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "transactionHash",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "taker",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "taker__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "taker__address",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "taker__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "taker__latestInteractionDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "takerGot",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "takerGave",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "penalty",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "feePaid",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__outbound_tkn",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__inbound_tkn",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__active",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "market__gasbase",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__id",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__creationDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__latestUpdateDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__wants",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__gives",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__expiryDate",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__fillWants",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__fillOrKill",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__restingOrder",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: {
            kind: "Name",
            value: "limitOrder__isOpen",
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Query",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "account",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "accounts",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Account_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Account_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Account",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "accountVolumeByPair",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "AccountVolumeByPair",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "accountVolumeByPairs",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "AccountVolumeByPair_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "AccountVolumeByPair_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "AccountVolumeByPair",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "market",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Market",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "markets",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Market_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Market_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Market",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "offer",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Offer",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "offers",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Offer_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Offer_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Offer",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "order",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Order",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "orders",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Order_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Order_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Order",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "limitOrder",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "LimitOrder",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "limitOrders",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "LimitOrder_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "LimitOrder_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "LimitOrder",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelDepositWithdraw",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "KandelDepositWithdraw",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelDepositWithdraws",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelDepositWithdraw_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelDepositWithdraw_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "KandelDepositWithdraw",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Kandel",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandels",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Kandel_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Kandel_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Kandel",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelPopulateRetract",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "KandelPopulateRetract",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelPopulateRetracts",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelPopulateRetract_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelPopulateRetract_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "KandelPopulateRetract",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelParameters",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelParameters_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelParameters_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "KandelParameters",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "orderStack",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "OrderStack",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "orderStacks",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderStack_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderStack_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "OrderStack",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          description: {
            kind: "StringValue",
            value: "Access to subgraph metadata",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_meta",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "_Meta_",
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "Subscription",
      },
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "account",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Account",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "accounts",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Account_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Account_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Account",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "accountVolumeByPair",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "AccountVolumeByPair",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "accountVolumeByPairs",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "AccountVolumeByPair_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "AccountVolumeByPair_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "AccountVolumeByPair",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "market",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Market",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "markets",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Market_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Market_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Market",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "offer",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Offer",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "offers",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Offer_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Offer_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Offer",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "order",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Order",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "orders",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Order_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Order_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Order",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "limitOrder",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "LimitOrder",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "limitOrders",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "LimitOrder_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "LimitOrder_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "LimitOrder",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelDepositWithdraw",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "KandelDepositWithdraw",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelDepositWithdraws",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelDepositWithdraw_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelDepositWithdraw_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "KandelDepositWithdraw",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandel",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Kandel",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandels",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Kandel_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Kandel_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Kandel",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelPopulateRetract",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "KandelPopulateRetract",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelPopulateRetracts",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelPopulateRetract_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelPopulateRetract_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "KandelPopulateRetract",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "kandelParameters",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelParameters_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "KandelParameters_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "KandelParameters",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "orderStack",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "id",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                  },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "OrderStack",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "orderStacks",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "skip",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "0",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "first",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Int",
                },
              },
              defaultValue: {
                kind: "IntValue",
                value: "100",
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderBy",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderStack_orderBy",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "orderDirection",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderDirection",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "where",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "OrderStack_filter",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              description: {
                kind: "StringValue",
                value:
                  "Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.",
                block: true,
              },
              name: {
                kind: "Name",
                value: "subgraphError",
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "_SubgraphErrorPolicy_",
                  },
                },
              },
              defaultValue: {
                kind: "EnumValue",
                value: "deny",
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "OrderStack",
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          description: {
            kind: "StringValue",
            value: "Access to subgraph metadata",
            block: true,
          },
          name: {
            kind: "Name",
            value: "_meta",
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "block",
              },
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "Block_height",
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "_Meta_",
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "_Block_",
      },
      fields: [
        {
          kind: "FieldDefinition",
          description: {
            kind: "StringValue",
            value: "The hash of the block",
            block: true,
          },
          name: {
            kind: "Name",
            value: "hash",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Bytes",
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          description: {
            kind: "StringValue",
            value: "The block number",
            block: true,
          },
          name: {
            kind: "Name",
            value: "number",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Int",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          description: {
            kind: "StringValue",
            value:
              "Integer representation of the timestamp stored in blocks for the chain",
            block: true,
          },
          name: {
            kind: "Name",
            value: "timestamp",
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Int",
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "ObjectTypeDefinition",
      description: {
        kind: "StringValue",
        value: "The type for the top-level _meta field",
        block: true,
      },
      name: {
        kind: "Name",
        value: "_Meta_",
      },
      fields: [
        {
          kind: "FieldDefinition",
          description: {
            kind: "StringValue",
            value:
              "Information about a specific subgraph block. The hash of the block\nwill be null if the _meta field has a block constraint that asks for\na block number. It will be filled if the _meta field has no block constraint\nand therefore asks for the latest  block\n",
            block: true,
          },
          name: {
            kind: "Name",
            value: "block",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "_Block_",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          description: {
            kind: "StringValue",
            value: "The deployment ID",
            block: true,
          },
          name: {
            kind: "Name",
            value: "deployment",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          description: {
            kind: "StringValue",
            value:
              "If `true`, the subgraph encountered indexing errors at some past block",
            block: true,
          },
          name: {
            kind: "Name",
            value: "hasIndexingErrors",
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Boolean",
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: "EnumTypeDefinition",
      name: {
        kind: "Name",
        value: "_SubgraphErrorPolicy_",
      },
      values: [
        {
          kind: "EnumValueDefinition",
          description: {
            kind: "StringValue",
            value:
              "Data will be returned even if the subgraph has indexing errors",
            block: true,
          },
          name: {
            kind: "Name",
            value: "allow",
          },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          description: {
            kind: "StringValue",
            value:
              "If the subgraph has indexing errors, data will be omitted. The default.",
            block: true,
          },
          name: {
            kind: "Name",
            value: "deny",
          },
          directives: [],
        },
      ],
      directives: [],
    },
  ],
};

export default buildASTSchema(schemaAST, {
  assumeValid: true,
  assumeValidSDL: true,
});
