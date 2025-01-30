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
