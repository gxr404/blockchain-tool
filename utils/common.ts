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

export function hexToFixUint8Array(hex: string) {
  if (hex.length % 2 !== 0) {
    hex = hex.padStart(hex.length, '0')
  }
  return new Uint8Array((hex.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16)))
}

export function Uint8ArrayToHex(u8: Uint8Array) {
  return Array.from(u8)
    .map((i) => i.toString(16).padStart(2, '0'))
    .join('')
}

export function utf8ToUint8Array(utf8: string) {
  const encoder = new TextEncoder()
  return encoder.encode(utf8)
}

/**
 * 将二进制字符串重新分组，如 8-bit 转 5-bit
 * 1. 若输入数据不足原始 bit 长度（如 8-bit），需在前面补 0
 * 2. 分割后，不足目标 bit 长度（如 5-bit）需在最后一组补 0
 *  示例：
 * - 输入: `1101101`（7-bit）
 * - 先补足 8-bit: `01101101`
 * - 分割成 5-bit 组: `01101 10100`
 *
 * @param {string} binary - 二进制字符串
 * @param {number} targetBitSize - 目标比特位大小 (默认 5)
 * @param {number} originalBitSize - 原始比特位大小 (默认 8)
 * @returns {string[]} - 重新分组后的二进制数组
 */
export function regroupBits(
  binary: string,
  targetBitSize: number = 5,
  originalBitSize: number = 8
) {
  if (!binary) return []
  // 确保原始 bit 长度对齐
  const paddingNeeded = binary.length % originalBitSize
  if (paddingNeeded !== 0) {
    // 不足 originalBitSize 如8位 在头部补0
    binary = binary.padStart(binary.length + (originalBitSize - paddingNeeded), '0')
  }
  const result = []

  for (let i = 0; i < binary.length; i += targetBitSize) {
    let segment = binary.slice(i, i + targetBitSize)
    //如果最后一组不足 targetBitSize，补 0
    if (segment.length < targetBitSize) {
      segment = segment.padEnd(targetBitSize, '0')
    }
    result.push(segment)
  }

  return result
}

export function fixHex(hex: string, originalBitSize = 2) {
  const paddingNeeded = hex.length % originalBitSize
  if (paddingNeeded !== 0) {
    // 不足 originalBitSize
    hex = hex.padStart(hex.length + (originalBitSize - paddingNeeded), '0')
  }
  return hex
}
