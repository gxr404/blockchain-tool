import BigNumber from 'bignumber.js'

/**
 * 最大公约数
 * @param num1
 * @param num2
 * @returns
 */
export function gcd(num1: string, num2: string, nonNegativeS = false) {
  const _num1 = BigNumber(num1, 10)
  const _num2 = BigNumber(num2, 10)
  const s = [BigNumber(1, 10), BigNumber(0, 10)]
  const t = [BigNumber(0, 10), BigNumber(1, 10)]

  function _gcd(num1: BigNumber, num2: BigNumber, index: number, s: BigNumber[], t: BigNumber[]) {
    if (num2.isZero()) {
      let sVal = s.at(index - 1)
      if (nonNegativeS && sVal?.isNegative()) {
        sVal = sVal.plus(_num2).mod(_num2)
      }
      return {
        gcd: num1.toString(10),
        s: sVal?.toString(10),
        t: t.at(index - 1)?.toString(10),
      }
    }
    // quotient.push(num1.dividedToIntegerBy(num2))

    const prevS = s.at(index - 1) ?? new BigNumber(0)
    const currentS = s.at(index) ?? new BigNumber(0)
    const currentQuotient = num1.dividedToIntegerBy(num2) //quotient.at(index) ?? new BigNumber(0)
    const _s = prevS.minus(currentS.times(currentQuotient))

    s.push(_s)
    const prevT = t.at(index - 1) ?? new BigNumber(0)
    const currentT = t.at(index) ?? new BigNumber(0)
    const _t = prevT.minus(currentT.times(currentQuotient))
    t.push(_t)

    return _gcd(num2, num1.mod(num2), index + 1, s, t)
  }

  return _gcd(_num1, _num2, 1, s, t)
}

export function lcm(num1: string, num2: string) {
  const _num1 = BigNumber(num1, 10)
  const _num2 = BigNumber(num2, 10)

  const gcdRes = gcd(num1, num2)
  const gcdNum = BigNumber(gcdRes.gcd, 10)
  return _num1.times(_num2).abs().div(gcdNum).toString(10)
}
