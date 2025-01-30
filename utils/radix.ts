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
  targetRadixPrefix: RadixPrefix,
) {
  if (sourceRadixPrefix === targetRadixPrefix) return String(num)
  return BigNumber(num, radixPrefixNumberMap[sourceRadixPrefix]).toString(
    radixPrefixNumberMap[targetRadixPrefix],
  )
}
