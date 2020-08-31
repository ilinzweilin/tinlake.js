import { Constructor, TinlakeParams } from '../Tinlake'
import { waitAndReturnEvents, executeAndRetry } from '../services/ethereum'
import { ethers } from 'ethers'

export function BorrowerActions<ActionsBase extends Constructor<TinlakeParams>>(Base: ActionsBase) {
  return class extends Base implements IBorrowerActions {
    issue = async (registry: string, tokenId: string) => {
      const txHash = await executeAndRetry(this.contracts['SHELF'].issue, [registry, tokenId, this.ethConfig])
      console.log(`[Issue Loan] txHash: ${txHash}`)
      return waitAndReturnEvents(this.eth, txHash, this.contracts['SHELF'].abi, this.transactionTimeout)
    }

    nftLookup = async (registry: string, tokenId: string) => {
      const nft = ethers.utils.solidityKeccak256(['address', 'uint'], [registry, tokenId])
      console.log('NFT Look Up]')
      const res = await executeAndRetry(this.contracts['SHELF'].nftlookup, [nft, this.ethConfig])
      return res[0].toString()
    }

    lock = async (loan: string) => {
      const txHash = await executeAndRetry(this.contracts['SHELF'].lock, [loan, this.ethConfig])
      console.log(`[Collateral NFT lock] txHash: ${txHash}`)
      return waitAndReturnEvents(this.eth, txHash, this.contracts['SHELF'].abi, this.transactionTimeout)
    }

    unlock = async (loan: string) => {
      const txHash = await executeAndRetry(this.contracts['SHELF'].unlock, [loan, this.ethConfig])
      console.log(`[Collateral NFT unlock] txHash: ${txHash}`)
      return waitAndReturnEvents(this.eth, txHash, this.contracts['SHELF'].abi, this.transactionTimeout)
    }

    close = async (loan: string) => {
      const txHash = await executeAndRetry(this.contracts['SHELF'].close, [loan, this.ethConfig])
      console.log(`[Loan close] txHash: ${txHash}`)
      return waitAndReturnEvents(this.eth, txHash, this.contracts['SHELF'].abi, this.transactionTimeout)
    }

    // REV: add support for partial borrow (probably only requires changes in actions and component in Tinlake UI)
    // REV: not required for MVP of rev pool UI
    borrow = async (loan: string, currencyAmount: string) => {
      const txHash = await executeAndRetry(this.contracts['SHELF'].borrow, [loan, currencyAmount, this.ethConfig])
      console.log(`[Borrow] txHash: ${txHash}`)
      return waitAndReturnEvents(this.eth, txHash, this.contracts['SHELF'].abi, this.transactionTimeout)
    }

    withdraw = async (loan: string, currencyAmount: string, usr: string) => {
      const txHash = await executeAndRetry(this.contracts['SHELF'].withdraw, [
        loan,
        currencyAmount,
        usr,
        this.ethConfig,
      ])
      console.log(`[Withdraw] txHash: ${txHash}`)
      return waitAndReturnEvents(this.eth, txHash, this.contracts['SHELF'].abi, this.transactionTimeout)
    }

    // REV: add support for partial repay (probably only requires changes in actions and component in Tinlake UI)
    // REV: not required for MVP of rev pool UI
    repay = async (loan: string, currencyAmount: string) => {
      const txHash = await executeAndRetry(this.contracts['SHELF'].repay, [loan, currencyAmount, this.ethConfig])
      console.log(`[Repay] txHash: ${txHash}`)
      return waitAndReturnEvents(this.eth, txHash, this.contracts['SHELF'].abi, this.transactionTimeout)
    }
  }
}

export type IBorrowerActions = {
  issue(registry: string, tokenId: string): Promise<any>
  nftLookup(registry: string, tokenId: string): Promise<any>
  lock(loan: string): Promise<any>
  unlock(loan: string): Promise<any>
  close(loan: string): Promise<any>
  borrow(loan: string, currencyAmount: string): Promise<any>
  withdraw(loan: string, currencyAmount: string, usr: string): Promise<any>
  repay(loan: string, currencyAmount: string): Promise<any>
}

export default BorrowerActions
