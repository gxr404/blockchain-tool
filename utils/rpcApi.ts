import localforage from 'localforage'

const BTC_RPC_API = '/bitcoin/rpc'

export const BTC_API_CACHE_KEY = 'btc_api'

interface Cache {
  getBlockCount?: number
  getBlockHash?: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getBlock?: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRawTransaction?: Record<string, any>
}
let cache: Cache = {}
let cacheBlockCount: null | number = null

const commonHeaders = {
  'content-type': 'text/plain',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initApiCache(initCache: any) {
  cache = { ...initCache }
  // console.log('cache ---', cache)
}

async function updateCache() {
  // ;(cache as any)[key] = value
  await localforage.setItem(BTC_API_CACHE_KEY, cache)
}

export function randomBlock() {}

export function getBlockCount() {
  if (cacheBlockCount) return Promise.resolve(cacheBlockCount)
  const fetchBody = {
    jsonrpc: '2.0',
    method: 'getblockcount',
    params: [],
  }
  const defaultBlockCount = 879507
  return fetch(BTC_RPC_API, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify(fetchBody),
  })
    .then((data) => data.json())
    .then((data) => {
      cacheBlockCount = data.result
      return data.result
    })
    .catch(() => defaultBlockCount)
}

export function getBlockHash(height: number) {
  if (cache?.getBlockHash?.[height]) return Promise.resolve(cache.getBlockHash[height])

  const fetchBody = {
    jsonrpc: '2.0',
    method: 'getblockhash',
    params: [height],
  }
  return fetch(BTC_RPC_API, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify(fetchBody),
  })
    .then((data) => data.json())
    .then((data) => {
      if (!cache.getBlockHash) cache.getBlockHash = {}
      cache.getBlockHash[height] = data.result
      updateCache()
      return data.result as string
    })
    .catch(() => '')
}

export async function getRandomBlock() {
  const lastBlock = await getBlockCount()
  // + 1 为了把最新的区块也包含上
  return Math.floor(Math.random() * lastBlock + 1)
}

export function getBlock(blockHash: string, isRaw = false) {
  const cacheKey = `${blockHash}-${isRaw}`
  if (cache?.getBlock?.[cacheKey]) return Promise.resolve(cache.getBlock[cacheKey])

  const fetchBody = {
    jsonrpc: '2.0',
    method: 'getblock',
    params: [blockHash, isRaw ? 0 : 1],
  }
  // console.log('fetchBody', fetchBody)
  return fetch(BTC_RPC_API, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify(fetchBody),
  })
    .then((data) => data.json())
    .then((data) => {
      if (!cache.getBlock) cache.getBlock = {}
      cache.getBlock[cacheKey] = data.result
      updateCache()
      return data.result
    })
    .catch(() => null)
}

export function getRawTransaction(txId: string, isJson: boolean = false) {
  const cacheKey = `${txId}-${isJson}`

  if (cache?.getRawTransaction?.[cacheKey])
    return Promise.resolve(cache.getRawTransaction[cacheKey])

  const fetchBody = {
    method: 'getrawtransaction',
    params: [txId, isJson ? 1 : 0],
  }
  // console.log('fetchBody', fetchBody)
  return fetch(BTC_RPC_API, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify(fetchBody),
  })
    .then((data) => data.json())
    .then((data) => {
      if (!cache.getRawTransaction) cache.getRawTransaction = {}
      cache.getRawTransaction[cacheKey] = data.result
      updateCache()
      return data.result
    })
    .catch(() => null)
}

function getCacheHash() {
  let blockHash: null | string = null
  const keys = Object.keys(cache?.getBlockHash || {})
  if (keys.length) {
    const randomIndex = Math.floor(Math.random() * keys.length)
    const hashKey = keys[randomIndex]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockHash = (cache?.getBlockHash as any)[hashKey] || null
    // console.log('使用缓存中的hash')
  }
  return blockHash
}

export async function getRandomTransaction(isJson: boolean = false) {
  const blockHeight = await getRandomBlock()

  let blockHash = null
  if (!Number.isInteger(blockHeight)) {
    blockHash = getCacheHash()
  } else {
    blockHash = await getBlockHash(blockHeight)
    if (!blockHash) blockHash = getCacheHash()
  }

  if (!blockHash) return null
  const blockInfo = await getBlock(blockHash)
  // console.log(blockInfo)
  // console.log(cache)
  if (!blockInfo || !Array.isArray(blockInfo.tx) || blockInfo.tx.length <= 0) return null
  const randomIndex = Math.floor(Math.random() * blockInfo.tx.length)
  const txId = blockInfo.tx[randomIndex]
  // console.log(txId)
  const txHex = await getRawTransaction(txId, isJson)
  return {
    block: {
      height: blockHeight,
      hash: blockHash,
      info: blockInfo,
    },
    txId,
    txHex,
  }
}

export async function getRandomBlockHeader() {
  const blockHeight = await getRandomBlock()
  let blockHash = null
  if (!Number.isInteger(blockHeight)) {
    blockHash = getCacheHash()
  } else {
    blockHash = await getBlockHash(blockHeight)
    if (!blockHash) blockHash = getCacheHash()
  }
  // const blockHash = await getBlockHash(blockHeight)
  if (!blockHash) return null
  const blockRawHex = await getBlock(blockHash, true)
  // console.log('blockRawHex', blockRawHex)
  if (!blockRawHex) return null
  const blockHeaderHex = blockRawHex.slice(0, 80 * 2)
  return {
    block: {
      height: blockHeight,
      hash: blockHash,
      headerHex: blockHeaderHex,
    },
  }
}
