import elliptic from 'elliptic'
import bs58 from 'bs58'

/**
 * hex私钥转wif私钥
 * @param hexPrivate
 */
type THexToWif = (
  hexPrivateKey: string,
  compressFlag: boolean,
  network?: 'mainnet' | 'testnet'
) => string
export const hexToWif: THexToWif = (hexPrivateKey, compressFlag = true, network = 'mainnet') => {
  if (!hexPrivateKey) return ''

  const versionPrefixMap = new Map([
    ['mainnet', '80'],
    ['testnet', 'ef'],
  ])
  const data = `${versionPrefixMap.get(network)}${hexPrivateKey}${compressFlag ? '01' : ''}`
  const checksum = hash256(data).secondSha256.slice(0, 8)
  let wif = ''
  try {
    wif = bs58.encode(hexToUint8Array(`${data}${checksum}`))
  } catch {
    throw new Error(`Invalid Wif`)
  }
  return wif
}

export function parseWif(wif: string) {
  if (!wif) {
    return {
      network: '',
      compress: '',
      privateKey: '',
    }
  }
  const data = bs58.decode(wif)
  if (data.length < 37) {
    throw new Error(`Invalid Wif`)
  }
  const network = data[0].toString(16) === '80' ? 'mainnet' : 'testnet'
  const privateKey = data
    .slice(1, 33)
    .reduce((p, v) => `${p}${v.toString(16).padStart(2, '0')}`, '')
  const isNoneCompress = data.length === 37
  const compress = isNoneCompress ? 'none-compress' : 'compress'
  const checksumBuffer = isNoneCompress ? data.slice(33) : data.slice(34)
  const checksum = checksumBuffer.reduce((p, v) => `${p}${v.toString(16).padStart(2, '0')}`, '')
  const checksumFiled = data
    .slice(0, isNoneCompress ? 33 : 34)
    .reduce((p, v) => `${p}${v.toString(16).padStart(2, '0')}`, '')

  if (hash256(checksumFiled).secondSha256.slice(0, 8) !== checksum) {
    throw new Error(`checksum error`)
  }
  return {
    network,
    privateKey,
    compress,
    checksum,
  }
}

export function derivePublicKey(hexPrivateKey = '', compress = true) {
  if (!hexPrivateKey) return ''
  const { ec: EC } = elliptic
  const secp256k1Ec = new EC('secp256k1')
  const key = secp256k1Ec.keyFromPrivate(hexPrivateKey)
  const pubPoint = key.getPublic()
  return pubPoint.encode('hex', compress)
}
