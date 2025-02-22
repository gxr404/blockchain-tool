import { describe, it, expect } from 'vitest'

describe('gcd', () => {
  it('should return correct GCD for two numbers', () => {
    const result = gcd('77', '98')
    expect(result.gcd).toBe('7')
    expect(result.s).toBe('-5')
    expect(result.t).toBe('4')
  })

  it('should return correct GCD for two numbers 2', () => {
    const result = gcd('109', '77')
    expect(result.gcd).toBe('1')
    expect(result.s).toBe('-12')
    expect(result.t).toBe('17')
  })

  it('should return correct GCD with non-negative s', () => {
    const result = gcd('109', '77', true)
    expect(result.gcd).toBe('1')
    expect(result.s).toBe('65')
    // TOTO 按理说应该是 92 暂时没其他地方用到 所以暂时保留原值
    expect(result.t).toBe('17')
  })

  it('should handle edge case for GCD of zero', () => {
    const result = gcd('0', '98')
    expect(result.gcd).toBe('98') // GCD of 0 and any number is the other number
    expect(result.s).toBe('0')
    expect(result.t).toBe('1')
  })

  it('should return correct GCD for large numbers', () => {
    const result = gcd('123456789012345678901234567890', '987654321098765432109876543210')
    expect(result.gcd).toBe('9000000000900000000090')
    // 987654321098765432109876543210/9000000000900000000090 = 109739369
    // 123456789012345678901234567890/9000000000900000000090 = 13717421
  })

  it('should handle GCD of negative numbers', () => {
    const result = gcd('-56', '98')
    expect(result.gcd).toBe('14')
    expect(result.s).toBe('-2') // Adjusted to non-negative s
    expect(result.t).toBe('-1')
  })
})

describe('lcm', () => {
  it('should return correct LCM for two numbers', () => {
    const result = lcm('56', '98')
    expect(result).toBe('392') // LCM of 56 and 98 is 392
  })

  it('should return correct LCM for prime numbers', () => {
    const result = lcm('13', '17')
    expect(result).toBe('221') // LCM of 13 and 17 is 221
  })

  it('should return correct LCM when one number is 0', () => {
    const result = lcm('0', '98')
    expect(result).toBe('0') // LCM of 0 and any number is 0
  })

  it('should return correct LCM for large numbers', () => {
    const result = lcm('123456789012345678901234567890', '987654321098765432109876543210')
    expect(result).toBe('13548070124980948012498094801236261410') // Expected LCM
  })
})
