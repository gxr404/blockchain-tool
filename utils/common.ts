export function checkHex(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError()
  }
  const hexRegex = /^[0-9a-fA-F]+$/
  if (!hexRegex.test(str)) {
    throw new Error('Invalid hexadecimal digits')
  }
  if (str.length % 2) {
    throw new Error('一个完整的字节由两位十六进制数字组成')
  }
  return true
}

export function hexToUint8Array(hex: string) {
  if (hex.length % 2 !== 0) {
    throw new Error('Hex string length must be even')
  }
  return new Uint8Array((hex.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16)))
}
