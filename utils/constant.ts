export const btcInfoSite = {
  block(blockNumber: number, blockHash: string) {
    return {
      learnmeabitcoin: `https://learnmeabitcoin.com/explorer/block/${blockHash}`,
      blockchain: `https://www.blockchain.com/explorer/blocks/btc/${blockNumber}`,
      mempool: `https://mempool.space/zh/block/${blockHash}`,
      oklink: `https://www.oklink.com/zh-hans/btc/block/${blockNumber}`,
    }
  },
  transaction(txId: string) {
    return {
      learnmeabitcoin: `https://learnmeabitcoin.com/explorer/tx/${txId}`,
      blockchain: `https://www.blockchain.com/explorer/transactions/btc/${txId}`,
      mempool: `https://mempool.space/zh/tx/${txId}`,
      oklink: `https://www.oklink.com/zh-hans/btc/tx/{txId}`,
    }
  },
}
