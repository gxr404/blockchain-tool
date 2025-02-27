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
      // 最大公约数的结果为负数时 转正 并将 s t 取反
      if (num1.isNegative()) {
        return {
          gcd: num1.abs().toString(10),
          s: sVal?.negated()?.toString(10),
          t: t
            .at(index - 1)
            ?.negated()
            ?.toString(10),
        }
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

/*
  根据数论可以把数字分为六大部分，6i、6i + 1、6i + 2、6i + 3、6i + 4、6i + 5，
  其中 6i、6i + 2、6i + 3、6i + 4 一定是合数，只有 6i + 1、6i + 5 才有可能是素数，
  所以一个数 x 对 6 取余，余数一定是 0、1、2、3、4、5 这六个数字，
  只有当余数为 1 或 5 时才有可能是素数，余数为 0、2、3、4 的一定是合数
 */
export function isPrime(num: string) {
  if (num === '2' || num === '3' || num === '5') return true
  const bigNum = BigNumber(num, 10)
  if (bigNum.isLessThanOrEqualTo(1)) return false
  // 余数为 0、2、3、4 的是合数
  if (!bigNum.mod(6).eq(1) && !bigNum.mod(6).eq(5)) return false
  let index = BigNumber(5)
  while (index.pow(2).isLessThanOrEqualTo(bigNum)) {
    if (bigNum.mod(index).eq(0) || bigNum.mod(index.plus(2)).eq(0)) {
      return false
    }
    index = index.plus(6)
  }
  return true
}
