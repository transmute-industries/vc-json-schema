### Verifiable Credential Schemas with Open API Specification

- [Editors Draft](https://transmute-industries.github.io/vc-credential-schema-open-api-specification/)

### Discussion Forums
* [W3C Credentials Community Group Mailing List (Incubation)](https://lists.w3.org/Archives/Public/public-credentials/)
* [W3C Verifiable Credentials WG Mailing List (Standardization)](https://lists.w3.org/Archives/Public/public-vc-wg/)

### Usage

```shell
curl -s https://transmute-industries.github.io/vc-credential-schema-open-api-specification/degree.yaml > degree2.yaml
# npm install -g ajv-cli
ajv validate -s degree2.yaml -d ./credential.json --strict=false
```

#### Contributing

```
git clone git@github.com:transmute-industries/vc-credential-schema-open-api-specification.git
cd vc-credential-schema-open-api-specification
npm install -g ajv-cli
ajv validate -s ./degree.yaml -d ./credential.json --strict=false
./credential.json valid
```

### Example

See [degree.yaml](degree.yaml) and [credential.json](credential.json).

```yaml
$id: https://example.org/examples/degree.yaml
title: University Degree Credential Schema
description: >-
  An OAS 3.0 Schema for an example 
  verifiable credential representing a university degree.
example: |-
  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "id": "http://example.edu/credentials/3732",
    "type": [
      "VerifiableCredential",
      "UniversityDegreeCredential"
    ],
    "issuer": "https://example.edu/issuers/14",
    "issuanceDate": "2010-01-01T19:23:24Z",
    "credentialSubject": {
      "id": "did:example:123",
      "degree": {
        "type": "BachelorDegree",
        "name": "Bachelor of Science and Arts"
      }
    },
    "credentialSchema": {
      "id": "https://example.org/examples/degree.yaml",
      "type": "OpenApiSpecificationValidator2022"
    },
    "proof": {
      "type": "JsonWebSignature2020",
      "created": "2022-02-25T14:58:43Z",
      "verificationMethod": "https://example.edu/issuers/14#keys-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..MJ5GwWRMsadCyLNXU_flgJtsS32584MydBxBuygps_cM0sbU3abTEOMyUvmLNcKOwOBE1MfDoB1_YY425W3sAg",
    }
  }
type: object
properties:
  '@context':
    type: array
    const:
      - 'https://www.w3.org/2018/credentials/v1'
      - 'https://www.w3.org/2018/credentials/examples/v1'
      - 'https://w3id.org/security/suites/jws-2020/v1'
  type:
    type: array
    readOnly: true
    const:
      - VerifiableCredential
      - UniversityDegreeCredential
    default:
      - VerifiableCredential
      - UniversityDegreeCredential
    items:
      type: string
      enum:
        - VerifiableCredential
        - UniversityDegreeCredential
  id:
    type: string
  issuer:
    type: string
  issuanceDate:
    type: string
  credentialSchema:
    type: object
    properties:
      id:
        type: string
      type:
        type: string
        const: OpenApiSpecificationValidator2022
  credentialSubject:
    type: object
    properties:
      id:
        type: string
      degree:
        type: object
        properties:
          type: 
            type: string
          name:
            type: string
  proof:
    type: object
    properties:
      type:
        type: string
        const: JsonWebSignature2020
      created:
        type: string
      verificationMethod:
        type: string
      proofPurpose:
        type: string
        const: assertionMethod
      jws:
        type: string

additionalProperties: false
required:
  - '@context'
  - id
  - type
  - issuanceDate
  - issuer
  - credentialSchema
  - credentialSubject    
```

