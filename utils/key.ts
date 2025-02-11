import elliptic from 'elliptic'

/**
 * hex私钥转wif私钥
 * @param hexPrivate
 */
// export function hexToWIF(hexPrivateKey: string) {
//   if (!hexPrivateKey) return ''
//   // step 1: add 80 prefix
//   const step1 = `80${hexPrivateKey}`
// }

export function derivePublicKey(hexPrivateKey = '', compress = true) {
  if (!hexPrivateKey) return ''
  const { ec: EC } = elliptic
  const secp256k1Ec = new EC('secp256k1')
  const key = secp256k1Ec.keyFromPrivate(hexPrivateKey)
  const pubPoint = key.getPublic()
  return pubPoint.encode('hex', compress)
}
