import BN from 'bn.js'
import elliptic from 'elliptic'

const { ec: EC, curve } = elliptic

interface Point {
  x: string
  y: string
}

// 使用 elliptic 计算的 taproot 公钥
// Q = P + t * G
export function genTaprootPublicKeyElliptic(publicKeyPoint: Point, tweak: string) {
  const secp256k1Ec = new EC('secp256k1')
  const mulPoint = secp256k1Ec.g.mul(new BN(tweak, 10))
  const pubKeyPair = secp256k1Ec.keyFromPublic(
    {
      x: new BN(publicKeyPoint.x, 10).toString(16),
      y: new BN(publicKeyPoint.y, 10).toString(16),
    },
    'hex'
  )
  let pubKey = pubKeyPair.getPublic()

  // y坐标奇数 则 翻转 y 方向 得到 -P
  if (pubKey.getY().isOdd()) {
    pubKey = pubKey.neg()
  }
  const resPoint = pubKey.add(mulPoint)
  return {
    x: resPoint.getX().toString(10),
    y: resPoint.getY().toString(10),
  }
}

// import BN from 'bn.js';

// // 定义曲线参数（Weierstrass 形式）
// const a = new BN('2', 10);  // a = 2
// const b = new BN('3', 10);  // b = 3
// const p = new BN('97', 10); // 素数 p = 97

// // 创建自定义曲线
// const customCurve = new curve.short({
//   p,        // 质数模数
//   a,        // a 参数
//   b,        // b 参数
//   g: ['3', '6'], // 基点 G(x, y)
//   n: new BN('5', 10), // 子群阶
//   h: new BN('1', 10), // 余因子
// });

// // 创建 EC 实例
// const customEC = new ec(customCurve);

// 使用 elliptic 做两点相加
export function eccAddElliptic(p1: Point, p2: Point, pV: string, aV: string, bV: string) {
  console.log(p1, p2, pV, aV, bV)
  const customCurve = new curve.short({
    p: new BN(pV, 10).toString(16),
    a: aV,
    b: bV,
  })
  const point1 = customCurve.point(new BN(p1.x, 10), new BN(p1.y, 10))
  const point2 = customCurve.point(new BN(p2.x, 10), new BN(p2.y, 10))
  const res = point1.add(point2)
  return { x: res.getX().toString(10), y: res.getY().toString(10) }
}
export function eccMultiplyElliptic(
  p1: Point,
  multiplyV: string,
  pV: string,
  aV: string,
  bV: string
) {
  const customCurve = new curve.short({
    p: new BN(pV, 10).toString(16),
    a: aV,
    b: bV,
  })
  const point1 = customCurve.point(new BN(p1.x, 10), new BN(p1.y, 10))
  const res = point1.mul(new BN(multiplyV, 10))
  return { x: res.getX().toString(10), y: res.getY().toString(10) }
}
