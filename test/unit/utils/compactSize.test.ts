import { describe, expect, test } from 'vitest'

describe('hexToCompactSize', () => {
  test('should throw error when input is empty', () => {
    expect(() => hexToCompactSize('')).toThrowError('数据为空')
  })

  test('should return compact size for decimal <= 252', () => {
    const result = hexToCompactSize('7f')
    expect(result).toEqual({
      prefix: '',
      data: '7f',
    })
  })

  test('should return fd prefix for decimal <= 65535', () => {
    const result = hexToCompactSize('ffff')
    expect(result).toEqual({
      prefix: 'fd',
      data: 'ffff',
    })
  })

  test('should return fe prefix for decimal <= 4294967295', () => {
    const result = hexToCompactSize('ffffffff')
    expect(result).toEqual({
      prefix: 'fe',
      data: 'ffffffff',
    })
  })

  test('should return ff prefix for decimal <= 18446744073709551615', () => {
    const result = hexToCompactSize('ffffffffffffffff')
    expect(result).toEqual({
      prefix: 'ff',
      data: 'ffffffffffffffff',
    })
  })

  test('should throw error when decimal > 18446744073709551615', () => {
    expect(() => hexToCompactSize('fffffffffffffffff')).toThrowError(
      'Compact Size 只能表示最大值为 18446744073709551615(0xffffffffffffffff).'
    )
  })

  test('should reverse the bytes correctly for fd prefix', () => {
    const result = hexToCompactSize('abcd')
    expect(result).toEqual({
      prefix: 'fd',
      data: 'cdab',
    })
  })

  test('should reverse the bytes correctly for fe prefix', () => {
    const result = hexToCompactSize('12345678')
    expect(result).toEqual({
      prefix: 'fe',
      data: '78563412',
    })
  })

  test('should reverse the bytes correctly for ff prefix', () => {
    const result = hexToCompactSize('1122334455667788')
    expect(result).toEqual({
      prefix: 'ff',
      data: '8877665544332211',
    })
  })
})

describe('compactSizeToHex', () => {
  test('should return compact size with no prefix for decimal <= 252', () => {
    const result = compactSizeToHex('7f')
    expect(result).toEqual({
      prefix: '',
      hex: '7f',
    })
  })

  test('should return fe prefix for decimal between 253 and 65535', () => {
    const result = compactSizeToHex('feffffffff')
    expect(result).toEqual({
      prefix: 'fe',
      hex: 'ffffffff',
    })
  })

  test('should return fd prefix for decimal between 65536 and 4294967295', () => {
    const result = compactSizeToHex('fdffff')
    expect(result).toEqual({
      prefix: 'fd',
      hex: 'ffff',
    })
  })

  test('should return ff prefix for decimal between 4294967296 and 18446744073709551615', () => {
    const result = compactSizeToHex('ffffffffffffffffff')
    expect(result).toEqual({
      prefix: 'ff',
      hex: 'ffffffffffffffff',
    })
  })

  test('should throw error for data length too short for prefix fd', () => {
    expect(() => compactSizeToHex('fdff')).toThrowError('Compact Size 错误, 前缀FD应不少于2字节')
  })

  test('should throw error for data length too long for prefix fd', () => {
    expect(() => compactSizeToHex('fdffffffff')).toThrowError(
      'Compact Size 错误, 前缀FD应不超过2字节'
    )
  })

  test('should throw error for data range out of bounds for prefix fd', () => {
    expect(() => compactSizeToHex('fd1000')).toThrowError(
      'Compact Size 错误, 前缀FD数据范围为 253 ~ 65535'
    )
  })

  test('should throw error for data length too short for prefix fe', () => {
    expect(() => compactSizeToHex('feff')).toThrowError('Compact Size 错误, 前缀FE应不少于4字节')
  })

  test('should throw error for data length too long for prefix fe', () => {
    expect(() => compactSizeToHex('fefffffffff')).toThrowError(
      'Compact Size 错误, 前缀FE应不超过4字节'
    )
  })

  test('should throw error for data range out of bounds for prefix fe', () => {
    expect(() => compactSizeToHex('fe10000000')).toThrowError(
      'Compact Size 错误, 前缀FE数据范围为 65536 ~ 4294967295'
    )
  })

  test('should throw error for data length too short for prefix ff', () => {
    expect(() => compactSizeToHex('fffffffffff')).toThrowError(
      'Compact Size 错误, 前缀FF应不少于8字节'
    )
  })

  test('should throw error for data length too long for prefix ff', () => {
    expect(() => compactSizeToHex('fffffffffffffffffff')).toThrowError(
      'Compact Size 错误, 前缀FF应不超过8字节'
    )
  })

  test('should throw error for data range out of bounds for prefix ff', () => {
    expect(() => compactSizeToHex('ff1000000000000000')).toThrowError(
      'Compact Size 错误, 前缀FF数据范围为 4294967296 ~ 18446744073709551615'
    )
  })

  test('should throw error for invalid prefix', () => {
    expect(() => compactSizeToHex('xx123456')).toThrowError('Compact Size 错误, 无有效前缀')
  })
})
