import { describe, it, expect } from 'vitest'
import sha256 from 'crypto-js/sha256'
import { keccak_256 } from '@noble/hashes/sha3'
import encHex from 'crypto-js/enc-hex'

// Mock 数据
const sampleTag = 'test'
const sampleHexData = '48656c6c6f' // 'Hello' in hex

describe('genTaggedHashPrefixes', () => {
  it('should generate the correct tagged hash prefix', () => {
    const expectedHash = sha256(sampleTag).toString()
    expect(genTaggedHashPrefixes(sampleTag)).toBe(expectedHash + expectedHash)
  })
})

describe('taggedHash', () => {
  it('should generate the correct tagged hash', () => {
    const prefix = genTaggedHashPrefixes(sampleTag)
    const expectedHash = sha256(encHex.parse(prefix + sampleHexData)).toString()
    expect(taggedHash(sampleTag, sampleHexData)).toBe(expectedHash)
  })
})

describe('keccak256', () => {
  it('should return correct keccak256 hash for hex input', () => {
    const expectedHash = keccak_256(Buffer.from(sampleHexData, 'hex'))
    expect(keccak256(sampleHexData, 'hex')).toEqual(expectedHash)
  })

  it('should return correct keccak256 hash for utf8 input', () => {
    const utf8Data = 'Hello'
    const expectedHash = keccak_256(Buffer.from(utf8Data, 'utf8'))
    expect(keccak256(utf8Data, 'utf8')).toEqual(expectedHash)
  })
})

describe('hash256', () => {
  it('should return the correct double SHA-256 hash', () => {
    const firstSha256 = sha256(encHex.parse(sampleHexData)).toString()
    const secondSha256 = sha256(encHex.parse(firstSha256)).toString()
    expect(hash256(sampleHexData)).toEqual({ firstSha256, secondSha256 })
  })
})
