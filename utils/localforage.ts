import localforage from 'localforage'
import { BTC_API_CACHE_KEY, initApiCache } from './rpcApi'

export async function init() {
  // 配置不同的驱动优先级
  localforage.config({
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
    name: 'blockchain_tool',
  })
  const cache = await localforage.getItem(BTC_API_CACHE_KEY)
  // console.log(cache)

  initApiCache(cache)
}
