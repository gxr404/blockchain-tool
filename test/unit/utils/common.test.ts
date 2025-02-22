import { describe, expect, it } from 'vitest'

it('isPrime should work', async () => {
  expect(isPrime('1')).toBe(false)
  expect(isPrime('12')).toBe(false)
  expect(isPrime('3')).toBe(true)
  expect(isPrime('13')).toBe(true)
  expect(isPrime('7')).toBe(true)
  // 7*11111111111111111111111
  expect(isPrime('77777777777777777777777')).toBe(false)
  // 7*11*17*73*101*137*5882353
  expect(isPrime('7777777777777777')).toBe(false)
  expect(isPrime('37955753')).toBe(false)
  // TODO: 很慢待优化
  // expect(isPrime('1000000000000002493')).toBe(true)
  // https://zh.numberempire.com/numberfactorizer.php
  // https://www.cnblogs.com/ljxtt/p/13514346.html
})

describe('regroupBits', () => {
  it('should regroup 8-bit binary string into 5-bit segments', () => {
    expect(regroupBits('11001100', 5, 8)).toEqual(['11001', '10000'])
  })

  it('should regroup 8-bit binary string into 4-bit segments', () => {
    expect(regroupBits('11011101', 4, 8)).toEqual(['1101', '1101'])
  })

  it('should pad input to match originalBitSize if necessary', () => {
    // '1100' 不足8bit 补齐
    // '00001100
    // 按每5bit 分割 最后不足补 结尾零
    // 00001 10000
    expect(regroupBits('1100', 5, 8)).toEqual(['00001', '10000'])
  })

  it('should pad last segment to match targetBitSize if necessary', () => {
    expect(regroupBits('10101010', 6, 8)).toEqual(['101010', '100000'])
  })

  it('should handle empty input', () => {
    expect(regroupBits('', 5, 8)).toEqual([])
  })

  it('should handle input that is already aligned to originalBitSize', () => {
    expect(regroupBits('11110000', 4, 8)).toEqual(['1111', '0000'])
  })

  it('should work when originalBitSize is smaller than targetBitSize', () => {
    // 1100 原字节大小4
    // 按6bit分割 不足结尾补零
    // '110000'
    expect(regroupBits('1100', 6, 4)).toEqual(['110000'])
  })

  it('should work with larger bit groups', () => {
    expect(regroupBits('110011001100', 3, 6)).toEqual(['110', '011', '001', '100'])
  })
})
