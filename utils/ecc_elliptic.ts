import BN from 'bn.js'
import elliptic from 'elliptic'

const { ec: EC } = elliptic

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
