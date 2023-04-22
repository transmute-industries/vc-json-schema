### Validating Verifiable Credentials with JSON Schema

- [Editors Draft](https://transmute-industries.github.io/vc-json-schema/)

### Discussion Forums
* [W3C Credentials Community Group Mailing List (Incubation)](https://lists.w3.org/Archives/Public/public-credentials/)
* [W3C Verifiable Credentials WG Mailing List (Standardization)](https://lists.w3.org/Archives/Public/public-vc-wg/)

### Usage

```shell
#!/bin/bash 

JWT=$(cat ./example/vc.jwt)
jq -R 'split(".") | .[1] | @base64d | fromjson' <<< "$JWT" > ./example/vc.json

echo "🌴 Validation"
ajv --spec=draft2020 compile -c ./customKeywords.js -s ./example/NewCredentialType.yaml
ajv --spec=draft2020 validate -c ./customKeywords.js -s ./example/NewCredentialType.yaml -d ./example/vc.json 
ajv --spec=draft2020 test -c ./customKeywords.js -s ./example/NewCredentialType.yaml -d ./example/vc.json --valid


curl -s https://transmute-industries.github.io/vc-json-schema/example/NewCredentialType.yaml > schema.yaml
curl -s https://transmute-industries.github.io/vc-json-schema/example/vc.jwt > vc.jwt
JWT=$(cat ./vc.jwt)
jq -R 'split(".") | .[1] | @base64d | fromjson' <<< "$JWT" > ./vc.json
ajv --spec=draft2020 test -c ./customKeywords.js -s ./schema.yaml -d ./vc.json --valid
```

See also [demo.sh](./demo.sh).

#### Contributing

```
git clone git@github.com:transmute-industries/vc-json-schema.git
cd vc-json-schema
```

### Example

See [NewCredentialType.yaml](./example/NewCredentialType.yaml) and [vc.jwt](./example/vc.jwt).

```yaml
$id: https://vendor.example/schemas/credential.yaml
title: Example Credential
description: >-
  An example verifiable credential with status and schema.
example: |-
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://w3id.org/vc/status-list/2021/v1",
      "https://w3id.org/vc/schema/2023/v1"
    ],
    "id": "http://vendor.example/credentials/1776",
    "type": ["VerifiableCredential", "NewCredentialType"],
    "issuer": {
      "id": "did:example:123",
      "type": ["Organization", "OrganizationType"]
    },
    "validFrom": "2010-01-01T19:23:24Z",
    "credentialSchema": {
      "id": "https://vendor.example/schemas/credential.yaml",
      "type": "JsonSchema"
    },
    "credentialStatus": {
      "id": "https://vendor.example/credentials/status/3#4",
      "type": "StatusList2021Entry",
      "statusPurpose": "suspension",
      "statusListIndex": "4",
      "statusListCredential": "https://vendor.example/credentials/status/3"
    },
    "credentialSubject": {
      "id": "did:example:456",
      "type": ["Person", "JobType"],
      "claimName": "claimValue"
    }
  }
type: object
properties:
  '@context':
    type: array
    const:
      - 'https://www.w3.org/ns/credentials/v2'
      - 'https://w3id.org/vc/status-list/2021/v1'
      - 'https://w3id.org/vc/schema/2023/v1'
  type:
    type: array
    readOnly: true
    const:
      - VerifiableCredential
      - NewCredentialType
    default:
      - VerifiableCredential
      - NewCredentialType
    items:
      type: string
      enum:
        - VerifiableCredential
        - NewCredentialType
  id:
    type: string
  issuer:
    type: object
    properties:
      id:
        type: string
      type:
        type: array
        readOnly: true
        const:
          - Organization
          - OrganizationType
        default:
          - Organization
          - OrganizationType
  validFrom:
    type: string
  credentialSchema:
    type: object
    properties:
      id:
        type: string
      type:
        type: string
        const: JsonSchema
  credentialStatus:
    type: object
    properties:
      id:
        type: string
      type:
        type: string
        const: StatusList2021Entry
      statusPurpose:
        type: string
      statusListIndex:
        type: string
      statusListCredential:
        type: string
  credentialSubject:
    type: object
    properties:
      id:
        type: string
      type:
        type: array
        readOnly: true
        const:
          - Person
          - JobType
        default:
          - Person
          - JobType
      claimName:
        type: string

additionalProperties: false
required:
  - '@context'
  - id
  - type
  - issuer
  - validFrom
  - credentialSchema
  - credentialStatus
  - credentialSubject       
```

