import BigNumber from 'bignumber.js'

interface Point {
  x: string
  y: string
}

export const getEccFormula = (a: number, b: number, p?: number) => {
  let axPart = ''
  let bPart = ''

  if (a !== 0) {
    const aSymbol = a > 0 ? '+' : '-'
    const aAbs = Math.abs(a)
    axPart = `${aSymbol} ${aAbs === 1 ? '' : aAbs}x`
  } else {
    axPart = ''
  }

  if (b !== 0) {
    const bSymbol = b > 0 ? '+' : '-'
    const bAbs = Math.abs(b)
    bPart = `${bSymbol} ${bAbs}`
  } else {
    bPart = ''
  }

  return `y^2 = x^3 ${axPart} ${bPart} ${p ? `\\mod ${p}` : ''}`
}

// eccAdd(
//   '57914003759334956055556319045915423115503170607252092205748771071357052725470',
//   '59022050314388146539210499719794280730422672321197528968026852677636920268580',
//   '54794285999389729682365180809618053515875262659545427784365076512494669834317',
//   '29048729373376850556116032055051042853542514458986339202288623260966814572559',
//   BigNumber('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16).toString(10)
// )

/**
 * 有限域点相加
 * - step1: 先求斜率 m = (y2-y1)/(x2-x1) mod p
 * - step2: 计算新点 x坐标
 * - step2: 计算新点 y坐标
 * p1 椭圆曲线上的点1  Rx = m^2 - x1 - x2 mod p
 * p2 椭圆曲线上的点2  Ry = m * (x1 - Rx) - y1 mod p
 * pV 模数
 * aV 椭圆曲线上的a
 * 入参都为10进制
 */
export function eccAdd(p1: Point, p2: Point, pV: string, aV: string) {
  const x1 = BigNumber(p1.x, 10)
  const y1 = BigNumber(p1.y, 10)

  const x2 = BigNumber(p2.x, 10)
  const y2 = BigNumber(p2.y, 10)
  const p = BigNumber(pV, 10)
  const a = BigNumber(aV, 10)

  // P1 + (-P1) = 无穷远点
  if (x1.eq(x2) && y1.eq(y2.negated())) {
    console.warn('-p1 = p2', p1, p2)
    throw new Error('计算结果为零')
    // return { x: null, y: null }
  }

  // step1 计算斜率
  let denominator
  let numerator

  if (x1.eq(x2) && y1.eq(y2)) {
    // P1 == P2 (点倍加)
    // 3 * x^2 + a mod p
    numerator = x1.pow(2).times(3).plus(a).mod(p)
    // step1.2 计算分子 y1 * 2  mod p
    denominator = y1.times(2).mod(p)
  } else {
    // 普通加法
    // step1.1 计算分母 (x2 - x1) mod p
    numerator = y2.minus(y1).mod(p)
    // step1.2 计算分子 (y2 - y1) mod p
    denominator = x2.minus(x1).mod(p)
  }

  // 处理负数
  denominator = positiveMod(denominator, p)
  numerator = positiveMod(numerator, p)

  // 分母不能0
  if (denominator.isZero()) {
    console.warn('分母不能0', p1, p2)
    throw new Error('计算结果为零 可能为点的阶')
    // return { x: null, y: null }
    // return { x: '0', y: '0' } // 无穷远点
  }

  // step1.3 注意 除法在模运算中需 使用模逆 转乘法
  const modInverse = gcd(denominator.toString(10), p.toString(10), true).s
  let m = numerator.times(modInverse || '').mod(p)
  m = positiveMod(m, p)

  // step2 计算 Rx = m^2 - x1 - x2 mod p
  let Rx = m.pow(2).minus(x1).minus(x2).mod(p)
  Rx = positiveMod(Rx, p)

  // step3 计算 Ry = m * (x1 - Rx) - y1 mod p
  let Ry = m.times(x1.minus(Rx)).minus(y1).mod(p)
  Ry = positiveMod(Ry, p)

  return { x: Rx.toString(10), y: Ry.toString(10) }
}

function positiveMod(a: BigNumber, p: BigNumber) {
  return a.mod(p).plus(p).mod(p)
}

/**
 * 检查点是否在椭圆曲线上 y^2 = x^3 + a * x + b mod p 还需满足 4 * a^3 + 27 * b^2 !==0
 * @param aV 曲线方程中 a
 * @param bV 曲线方程中 b
 * @param pV 曲线方程中mod值 p
 * @param point 需要判断的点
 * 入参都为10进制
 */
export function checkEccPoint(aV: string, bV: string, pV: string, point: Point) {
  const a = BigNumber(aV, 10)
  const b = BigNumber(bV, 10)
  const p = BigNumber(pV, 10)

  const x = BigNumber(point.x, 10)
  const y = BigNumber(point.y, 10)

  // 是否需要 mod p ??
  // 4 * a^3 + 27 * b^2 mod p!==0 ??
  // 4 * a^3 + 27 * b^2 !==0
  if (a.pow(3).times(4).plus(b.pow(2).times(2)).isZero()) {
    throw new Error(' 4 * a^3 + 27 * b^2 !==0')
  }

  return x.pow(3).plus(a.times(x)).plus(b).mod(p).eq(y.pow(2).mod(p))
}

/**
 * 点倍乘
 * 使用二进制方法（Double-and-Add)
 *  计算  19 * P
 *  假设：19 = (10011)_2
 *  计算过程：
 *    1.	最高位 1（起始值）→ 设 R = P
 *    2.	读到 0 → 倍加（ R = 2P ）
 *    3.	读到 0 → 倍加（ R = 4P ）
 *    4.	读到 1 → 倍加 + 加（ R = 8P + P = 9P ）
 *    5.	读到 1 → 倍加 + 加（ R = 18P + P = 19P ）
 *  最终得到：
 *    19P = (((P * 2) * 2) * 2 + P) * 2 + P
 *  相比 P+P...... 快

 * @param p1 点
 * @param multiplyV 乘数
 * @param pV 曲线方程中mod值 p
 * @param aV 曲线方程中 a
 */
export function eccMultiply(p1: Point, multiplyV: string, pV: string, aV: string) {
  const multiply = BigNumber(multiplyV, 10)
  let _R0: Point = p1
  const multiplyBinary = multiply.toString(2)
  for (let i = 1; i < multiplyBinary.length; i++) {
    if (multiplyBinary[i] === '1') {
      _R0 = eccAdd(_R0, _R0, pV, aV) as Point
      _R0 = eccAdd(_R0, p1, pV, aV) as Point
    } else {
      _R0 = eccAdd(_R0, _R0, pV, aV) as Point
    }
  }
  return _R0
}

const Secp256k1 = {
  G: {
    x: BigNumber('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
    y: BigNumber('483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16),
  },
  mod: BigNumber('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16),
}

/**
 * 生成taproot公钥点 Q = P + t * G
 *  - G点 为Secp256k1算法的常量值
 *  - t tweak 10进制
 *  - P 为 公钥point
 *  - 参数都以10进制
 *  - P的y坐标如果为奇数 得使用-P去计算 则变成(-P) + t * G
 * @returns
 */
export function genTaprootPublicKey(publicKeyPoint: Point, tweak: string) {
  const G = {
    x: Secp256k1.G.x.toString(10),
    y: Secp256k1.G.y.toString(10),
  }

  const modDecimal = Secp256k1.mod.toString(10)
  const mulPoint = eccMultiply(G, tweak, modDecimal, '0')
  const publicKeyY = BigNumber(publicKeyPoint.y, 10)
  const _internalPublicKey = {
    x: publicKeyPoint.x,
    y: publicKeyPoint.y,
  }
  // 公钥y坐标为奇数的 取 -P
  if (publicKeyY.mod(2).eq(1)) {
    _internalPublicKey.y = publicKeyY.negated().mod(Secp256k1.mod).toString(10)
  }
  return eccAdd(_internalPublicKey, mulPoint, modDecimal, '0')
}
