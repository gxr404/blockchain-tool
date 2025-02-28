export const routeList = [
  {
    title: '哈希算法',
    id: 'hash',
    children: [
      {
        id: 'hash-hash256',
        path: '/hash/hash256',
        title: 'Hash256',
      },
      {
        id: 'hash-hash160',
        path: '/hash/hash160',
        title: 'Hash160',
      },
      {
        id: 'hash-tagged',
        path: '/hash/tagged',
        title: 'Tagged Hash',
      },
      {
        id: 'hash-keccak256',
        path: '/hash/keccak256',
        title: 'Keccak256',
      },
    ],
  },
  {
    title: '密码学',
    id: 'cryptology',
    children: [
      {
        title: '椭圆曲线',
        id: 'elliptic-curve',
        children: [
          { id: 'cryptology-ecc', path: '/cryptology/ecc', title: 'ECC基础' },
          { id: 'cryptology-ecc-op', path: '/cryptology/ecc-op', title: 'ECC常用操作' },
          { id: 'cryptology-secp256k1', path: '/cryptology/secp256k1', title: 'Secp256k1' },
          {
            id: 'cryptology-twisted-edwards',
            path: '/cryptology/twisted-edwards',
            title: 'Twisted Edwards',
          },
          {
            id: 'cryptology-sign',
            title: '基于椭圆曲线的签名算法',
            children: [
              { id: 'cryptology-sign-ecdsa', title: 'ECDSA', path: '/cryptology/sign/ecdsa' },
              { id: 'cryptology-sign-eddsa', title: 'EdDSA', path: '/cryptology/sign/eddsa' },
              { id: 'cryptology-sign-schnorr', title: 'Schnorr', path: '/cryptology/sign/schnorr' },
            ],
          },
          {
            id: 'cryptology-key-exchange',
            title: '基于椭圆曲线的密钥交换',
            children: [
              {
                id: 'cryptology-key-exchange-ecdh',
                path: '/cryptology/key-exchange/ecdh',
                title: 'ECDH',
              },
            ],
          },
          // {
          //   id: 'cryptology-crypto',
          //   title: '基于椭圆曲线的加密算法',
          //   children: [
          //     {
          //       id: 'cryptology-crypto-ecc',
          //       path: '/cryptology/crypto/ecies',
          //       title: 'ECIES',
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
  {
    title: '地址',
    id: 'address',
    children: [
      {
        id: 'bitcoin',
        title: 'Bitcoin',
        icon: 'bitcoin' as const,
        children: [
          {
            title: '公钥生成',
            id: 'address-bitcoin-gen-public-key',
            path: '/address/bitcoin/gen-public-key',
          },
          {
            title: 'Base58',
            id: 'address-bitcoin-base58',
            path: '/address/bitcoin/base58',
          },
          {
            title: 'Bech32',
            id: 'address-bitcoin-bech32',
            path: '/address/bitcoin/bech32',
          },
          {
            title: 'Bech32m',
            id: 'address-bitcoin-bech32m',
            path: '/address/bitcoin/bech32m',
          },
          {
            title: 'WIF私钥',
            id: 'address-bitcoin-wif',
            path: '/address/bitcoin/wif',
          },

          {
            title: '助记词转化(待定...)',
            id: 'address-bitcoin-wif',
            link: 'https://bip32jp.github.io/english/',
            // https://github.com/iancoleman/bip39
          },
          {
            title: 'Opcode列表',
            id: 'address-bitcoin-opcode',
            path: '/address/bitcoin/opcode',
          },
        ],
      },
      {
        id: 'address-ethereum',
        path: '/address/ethereum',
        title: 'Ethereum',
        icon: 'ethereum' as const,
      },
      {
        id: 'address-solana',
        path: '/address/solana',
        title: 'Solana',
        icon: 'solana' as const,
      },
    ],
  },
  {
    title: '通用',
    id: 'general',
    children: [
      {
        id: 'general-base-converter',
        path: '/general/base-converter',
        title: '进制转换',
      },
      {
        id: 'general-ascii-converter',
        path: '/general/ascii-converter',
        title: '字节与Ascii转换',
      },
      {
        id: 'general-little-endian',
        path: '/general/little-endian',
        title: '小端字节序',
      },
      {
        id: 'general-compact-size',
        path: '/general/compact-size',
        title: 'Compact Size',
      },
    ],
  },
  {
    title: '数学',
    id: 'math',
    children: [
      {
        id: 'math-base',
        path: '/math/base',
        title: '基础',
      },
      {
        id: 'math-mod-operation-theory',
        path: '/math/mod-operation-theory',
        title: '模运算(理论)',
      },
      {
        id: 'math-mod-operation-app',
        path: '/math/mod-operation-app',
        title: '模运算',
      },
    ],
  },
]
