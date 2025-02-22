import { describe, expect, it } from 'vitest'

describe('ecc', () => {
  const curve = {
    p: '29',
    a: '4',
    b: '20',
  }

  it('eccAdd should work', async () => {
    const P = { x: '24', y: '22' }
    const curveParams = [curve.a, curve.b, curve.p] as const
    expect(checkEccPoint(...curveParams, P)).toBe(true)
    const P2 = eccAdd(...curveParams, P, P)
    expect(P2).toEqual({
      x: '5',
      y: '22',
    })

    expect(checkEccPoint(...curveParams, P2)).toBe(true)
    const P3 = eccAdd(...curveParams, P2, P)
    expect(P3).toEqual({
      x: '0',
      y: '7',
    })
    expect(checkEccPoint(...curveParams, P3)).toBe(true)
    const P4 = eccAdd(...curveParams, P2, P2)
    expect(P4).toEqual({
      x: '14',
      y: '6',
    })
    expect(checkEccPoint(...curveParams, P4)).toBe(true)
    expect(P4).toEqual(eccAdd(...curveParams, P3, P))

    const SECP256K1Point = eccAdd(
      SECP256K1_CONST.a.toString(10),
      SECP256K1_CONST.b.toString(10),
      SECP256K1_CONST.mod.toString(10),
      {
        x: '57914003759334956055556319045915423115503170607252092205748771071357052725470',
        y: '59022050314388146539210499719794280730422672321197528968026852677636920268580',
      },
      {
        x: '54794285999389729682365180809618053515875262659545427784365076512494669834317',
        y: '29048729373376850556116032055051042853542514458986339202288623260966814572559',
      }
    )
    expect(SECP256K1Point).toEqual({
      x: '9558326154941729846506150842718940243890197003916516739362296231250577036166',
      y: '61895084547891582448074919698515382812484065993821487369582635866416389495254',
    })
  })

  it('eccMultiply should work', async () => {
    const P = { x: '24', y: '22' }
    const curveParams = [curve.a, curve.b, curve.p] as const
    expect(checkEccPoint(...curveParams, P)).toBe(true)
    // 4P
    const P4 = eccMultiply(...curveParams, P, '4')
    expect(checkEccPoint(...curveParams, P4)).toBe(true)
    expect(P4).toEqual({
      x: '14',
      y: '6',
    })
    // 点 P 的阶为 37
    expect(() => eccMultiply(...curveParams, P, '37')).toThrowError('计算结果为零 可能为点的阶')
  })

  it('eccAddElliptic should work', async () => {
    const point = { x: '24', y: '22' }
    const curveParams = [curve.a, curve.b, curve.p] as const
    expect(checkEccPoint(...curveParams, point)).toBe(true)
    const P2 = eccAddElliptic(...curveParams, point, point)
    expect(P2).toEqual({
      x: '5',
      y: '22',
    })

    expect(checkEccPoint(...curveParams, P2)).toBe(true)
    const P3 = eccAddElliptic(...curveParams, P2, point)
    expect(P3).toEqual({
      x: '0',
      y: '7',
    })
    expect(checkEccPoint(...curveParams, P3)).toBe(true)
    const P4 = eccAddElliptic(...curveParams, P2, P2)
    expect(P4).toEqual({
      x: '14',
      y: '6',
    })
    expect(checkEccPoint(...curveParams, P4)).toBe(true)
    expect(P4).toEqual(eccAddElliptic(...curveParams, P3, point))
  })

  it('eccMultiplyElliptic should work', async () => {
    const P = { x: '24', y: '22' }
    const curveParams = [curve.a, curve.b, curve.p] as const
    expect(checkEccPoint(...curveParams, P)).toBe(true)
    // 4P
    const P4 = eccMultiplyElliptic(...curveParams, P, '4')
    expect(checkEccPoint(...curveParams, P4)).toBe(true)
    expect(P4).toEqual({
      x: '14',
      y: '6',
    })
    // 点 P 的阶为 37
    const P37 = eccMultiplyElliptic(...curveParams, P, '37')
    expect(P37).toEqual({
      x: '',
      y: '',
    })
  })
})
