
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Ajv = require('ajv');
const addFormats = require('ajv-formats').default;
const jose = require('jose');
const axios = require('axios');
const yaml = require('js-yaml');

const { VerifiableCredential, StatusList } = require('@transmute/vc-jwt-status-list')

const privateKeyJwk = {
  kty: 'EC',
  crv: 'P-256',
  alg: `ES256`,
  d: 'sjKZ6OT5F3d2IOiq9JkZ7WMR2rUqlNa3TumkrcedrBM',
  x: 'MYvnaI87pfrn3FpTqW-yNiFcF1K7fedJiqapm20_q7c',
  y: '9YEbT6Tyuc7xp9yRvhOUVKK_NIHkn5HpK9ZMgvK5pVw',
}

const getIssuer = () =>{
  const { d, ...publicKeyJwk } = privateKeyJwk;
  const issuer = `did:jwk:${jose.base64url.encode(JSON.stringify(publicKeyJwk))}`;
  return issuer
}

const signer = {
  sign: async ({ header, claimset }) => {
    const jwt = await new jose.CompactSign(
      Buffer.from(JSON.stringify(claimset)),
    )
      .setProtectedHeader(header)
      .sign(await jose.importJWK(privateKeyJwk))
    return jwt
  },
}

const getPublicKey = async (verificationMethod) => jose.importJWK(JSON.parse(jose.base64url.decode(verificationMethod.split(':')[2].split('#')[0])));

const verifier = {
  verify: async ({ jwt }) => {
    const { iss, kid } = jose.decodeProtectedHeader(jwt)
    const publicKey = await getPublicKey(iss + kid);
    // or...
    // const publicKey = await jose.importJWK(privateKeyJwk)
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey)
    return { protectedHeader, payload }
  },
}


const ajv = new Ajv({
  loadSchema: async (uri) => {
    if (!uri.startsWith('https')) {
      // const base = 'https://w3id.org/traceability/openapi/components/schemas/';
      const { data } = await axios.get(`${base}${uri}`);
      const loaded = yaml.load(data);
      const json = JSON.parse(JSON.stringify(loaded));
      return json;
    }
    throw new Error(`Unresolvable schema: ${uri}`);
  },
});
addFormats(ajv);
ajv.addKeyword('example');

(async ()=>{
  const schemaYaml = yaml.load(fs.readFileSync(path.resolve(__dirname, './NewCredentialType.yml')).toString())
  const schemaJson = JSON.parse(JSON.stringify(schemaYaml));
  fs.writeFileSync('./NewCredentialType.json', JSON.stringify(schemaJson, null, 2))
  const { example } = schemaJson
  const claimset = JSON.parse(example);
  claimset.issuer.id = getIssuer()
  const verifiableCredential = await VerifiableCredential.create({
    header: {
      alg: 'ES256',
      iss: claimset.issuer.id,
      kid: '#0',
      typ: 'vc+ld+jwt',
      cty: 'vc+ld+json',
    },
    claimset,
    signer,
  });
  fs.writeFileSync('./vc.jwt', verifiableCredential)
  // verify and check status
  const verification = await VerifiableCredential.verify({
    jwt: verifiableCredential,
    verifier,
    resolver: {
      resolve: async (id) => {
        if (id === 'https://vendor.example/credentials/status/3') {
          return StatusList.create({
            id,
            alg: 'ES256',
            iss: claimset.issuer.id,
            kid: '#0',
            iat: moment('2021-04-05T14:27:40Z').unix(),
            length: 8,
            purpose: 'suspension',
            signer,
          })
        }
        throw new Error('unsupported status list.')
      },
    }
  })
  const validate = ajv.addSchema(schemaJson).getSchema(verification.payload.credentialSchema.id)
  const valid = validate(verification.payload);
  if (validate.errors) {
    console.error(validate.errors);
  }
  fs.writeFileSync('./verification.json', JSON.stringify({schema: valid, ...verification}, null, 2))
})()