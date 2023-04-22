const jose = require('jose');

 const privateKeyJwk = {
  kty: 'EC',
  crv: 'P-256',
  alg: `ES256`,
  d: 'sjKZ6OT5F3d2IOiq9JkZ7WMR2rUqlNa3TumkrcedrBM',
  x: 'MYvnaI87pfrn3FpTqW-yNiFcF1K7fedJiqapm20_q7c',
  y: '9YEbT6Tyuc7xp9yRvhOUVKK_NIHkn5HpK9ZMgvK5pVw',
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

const verifier = {
  verify: async ({ jwt }) => {
    // const { iss, kid } = jose.decodeProtectedHeader(jwt)
    // const publicKey = await getPublicKey(iss + kid);
    // or...
    const publicKey = await jose.importJWK(privateKeyJwk)
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey)
    return { protectedHeader, payload }
  },
}

module.exports = {
  signer,
  verifier,
  privateKeyJwk
}