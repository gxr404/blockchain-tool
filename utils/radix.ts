import BigNumber from 'bignumber.js'

export type RadixKey = 'binary' | 'octal' | 'decimal' | 'hexadecimal'
export type RadixPrefix = '0b' | '0o' | '0d' | '0x'

export const radixPrefixMap: Record<RadixKey, RadixPrefix> = {
  binary: '0b',
  octal: '0o',
  decimal: '0d',
  hexadecimal: '0x',
}

export const radixPrefixNumberMap: Record<RadixPrefix, number> = {
  '0b': 2,
  '0o': 8,
  '0d': 10,
  '0x': 16,
}

export function transformRadix(
  num: number | string,
  sourceRadixPrefix: RadixPrefix,
  targetRadixPrefix: RadixPrefix
) {
  if (num === '') return ''
  if (sourceRadixPrefix === targetRadixPrefix) return String(num)
  return BigNumber(num, radixPrefixNumberMap[sourceRadixPrefix]).toString(
    radixPrefixNumberMap[targetRadixPrefix]
  )
}

export const byteToRadixBits = {
  '0b': 8,
  '0o': 3,
  '0d': 3,
  '0x': 2,
}

export function convertBytesToRadix(hexData: number | string, targetRadixPrefix: RadixPrefix) {
  if (hexData === '') return ''
  const dataArr = String(hexData).match(/../g) || []
  return dataArr
    .map((byte) => {
      return parseInt(byte, 16).toString(radixPrefixNumberMap[targetRadixPrefix])
    })
    .join('')
}
