import sha256 from 'crypto-js/sha256'
import encHex from 'crypto-js/enc-hex'
import encUtf8 from 'crypto-js/enc-utf8'
import ripemd160 from 'crypto-js/ripemd160'
import { keccak_256 } from '@noble/hashes/sha3'

export function hash256(hexData: string) {
  // sha256Data 1 a76dd73790def7b57776f22fa211d19cf43121a709a37eaeda17230eaac258f5
  // HashView.vue:11 hash256Data e6552a4bdb0ab6e2f487fd3a3f683180bb675a664c142f34004534f054520e39
  // console.log('hexData', hexData)

  const firstSha256 = sha256(encHex.parse(hexData)).toString()
  const secondSha256 = sha256(encHex.parse(firstSha256)).toString()

  return {
    firstSha256,
    secondSha256,
  }
}

export const TAGGED_HASH_TAGS = [
  'BIP0340/challenge',
  'BIP0340/aux',
  'BIP0340/nonce',
  'TapLeaf',
  'TapBranch',
  'TapSighash',
  'TapTweak',
  'KeyAgg list',
  'KeyAgg coefficient',
] as const

export function hash160(hexData: string) {
  const firstSha256 = sha256(encHex.parse(hexData)).toString()
  const ripemd160Data = ripemd160(encHex.parse(firstSha256)).toString()

  return {
    firstSha256,
    ripemd160: ripemd160Data,
  }
}

/**
 * 生成 TaggedHash 的tag前缀
 */
export function genTaggedHashPrefixes(tag: string) {
  const hashRes = sha256(encUtf8.parse(tag)).toString()
  return hashRes + hashRes
}

export function taggedHash(tag: string, hexData: string) {
  return sha256(encHex.parse(genTaggedHashPrefixes(tag) + hexData)).toString()
}

export type InputType = 'hex' | 'utf8'

export function keccak256(data: string, inputType: InputType = 'hex') {
  const wordFnMap = {
    hex: hexToUint8Array,
    utf8: utf8ToUint8Array,
  }
  const getCurrentWordFn = wordFnMap[inputType]
  // console.log(getCurrentWordFn(data), wordFnMap.hex('0' + data))
  if (typeof getCurrentWordFn !== 'function') {
    console.warn('not found')
    return new Uint8Array([])
  }
  return keccak_256(getCurrentWordFn(data))
}
