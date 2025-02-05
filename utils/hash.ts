import sha256 from 'crypto-js/sha256'
import enc from 'crypto-js/enc-hex'
import ripemd160 from 'crypto-js/ripemd160'

export function hash256(hexData: string) {
  // sha256Data 1 a76dd73790def7b57776f22fa211d19cf43121a709a37eaeda17230eaac258f5
  // HashView.vue:11 hash256Data e6552a4bdb0ab6e2f487fd3a3f683180bb675a664c142f34004534f054520e39
  // console.log('hexData', hexData)

  const firstSha256 = sha256(enc.parse(hexData)).toString()
  const secondSha256 = sha256(enc.parse(firstSha256)).toString()

  return {
    firstSha256,
    secondSha256,
  }
}

export function hash160(hexData: string) {
  const firstSha256 = sha256(enc.parse(hexData)).toString()
  const ripemd160Data = ripemd160(enc.parse(firstSha256)).toString()

  return {
    firstSha256,
    ripemd160: ripemd160Data,
  }
}
