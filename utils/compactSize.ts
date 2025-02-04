import BigNumber from 'bignumber.js'

export function hexToCompactSize(hex: string) {
  if (!hex.length) throw new Error('数据为空')

  const decimal = BigNumber(hex, 16)
  if (decimal.comparedTo(252, 10) <= 0) {
    return {
      prefix: '',
      data: hex.padStart(2, '0'),
    }
  } else if (decimal.comparedTo(65535, 10) <= 0) {
    return {
      prefix: 'fd',
      data:
        hex
          .padStart(2 * 2, '0')
          .match(/../g)
          ?.reverse()
          .join('') || '',
    }
  } else if (decimal.comparedTo(4294967295, 10) <= 0) {
    return {
      prefix: 'fe',
      data:
        hex
          .padStart(4 * 2, '0')
          .match(/../g)
          ?.reverse()
          .join('') || '',
    }
  } else if (decimal.comparedTo(BigNumber('18446744073709551615', 10), 10) <= 0) {
    return {
      prefix: 'ff',
      data:
        hex
          .padStart(8 * 2, '0')
          .match(/../g)
          ?.reverse()
          .join('') || '',
    }
  }
  throw new Error('Compact Size 只能表示最大值为 18446744073709551615(0xffffffffffffffff).')

  // FD – The next two bytes (253 - 65535)
  // FE – The next four bytes (65536 - 4294967295)
  // FF – The next eight bytes (4294967296 - 18446744073709551615)
}

export function compactSizeToHex(compactSize: string) {
  compactSize = compactSize.toLocaleLowerCase()
  const hex = compactSize
  if (compactSize.length <= 2) {
    return {
      hex,
      prefix: '',
    }
  }
  const prefix = compactSize.slice(0, 2)
  const data = compactSize.slice(2)
  if (prefix === 'fe') {
    const hexLen = 2 * 2
    if (data.length === hexLen) {
      return {
        prefix: 'fe',
        hex: data.match(/../g)?.reverse().join('') || '',
      }
    }
    throw new Error(`Compact Size 错误, 前缀FE应不${data.length > hexLen ? '超过' : '少于'}2字节`)
  } else if (prefix === 'fd') {
    const hexLen = 2 * 4
    if (data.length === hexLen) {
      return {
        prefix: 'fd',
        hex: data.match(/../g)?.reverse().join('') || '',
      }
    }
    throw new Error(`Compact Size 错误, 前缀FD 应不${data.length > hexLen ? '超过' : '少于'}4字节`)
  } else if (prefix === 'ff') {
    const hexLen = 2 * 8
    if (data.length === hexLen) {
      return {
        prefix: 'ff',
        hex: data.match(/../g)?.reverse().join('') || '',
      }
    }
    throw new Error(`Compact Size 错误, 前缀FF应不${data.length > hexLen ? '超过' : '少于'}8字节`)
  }
  throw new Error('Compact Size 错误, 无有效前缀')
}
