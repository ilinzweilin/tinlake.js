import { Constructor, TinlakeParams, PendingTransaction } from '../Tinlake'
const abiCoder = require('web3-eth-abi')
import BN from 'bn.js'
import { ethers } from 'ethers'

export function ProxyActions<ActionsBase extends Constructor<TinlakeParams>>(Base: ActionsBase) {
  return class extends Base implements IProxyActions {
    getProxyAccessTokenOwner = async (tokenId: string): Promise<BN> => {
      return this.contract('PROXY_REGISTRY').ownerOf(tokenId)
    }

    buildProxy = async (owner: string) => {
      const tx = await this.contract('PROXY_REGISTRY')['build(address)'](owner)
      const receipt = await this.getTransactionReceipt(tx)

      if (!(receipt.logs && receipt.logs[1])) {
        throw new Error('Created() event missing in proxyRegistry.build(address) receipt')
      }

      // Two events are emitted: Transfer() (from the ERC721 contract mint method) and Created() (from the ProxyRegistry contract)
      // We parse the 4th arg of the Created() event, to grab the access token
      const parsedLog = this.contract('PROXY_REGISTRY').interface.parseLog(receipt.logs[1])
      const accessToken = parsedLog.values['3'].toNumber()

      return accessToken
    }

    getProxy = async (accessTokenId: string) => {
      return await this.contract('PROXY_REGISTRY').proxies(accessTokenId)
    }

    getProxyAccessToken = async (proxyAddress: string) => {
      const proxy = this.contract('PROXY', proxyAddress)
      const accessToken = (await proxy.accessToken()).toBN()
      return accessToken.toNumber()
    }

    getProxyOwnerByLoan = async (loanId: string) => {
      const loanOwner = this.contract('TITLE').ownerOf(loanId)
      const accessToken = await this.getProxyAccessToken(loanOwner)
      return this.getProxyAccessTokenOwner(accessToken)
    }

    getProxyOwnerByAddress = async (proxyAddress: string) => {
      const accessToken = await this.getProxyAccessToken(proxyAddress)
      return this.getProxyAccessTokenOwner(accessToken)
    }

    proxyCount = async (): Promise<BN> => {
      return (await this.contract('PROXY_REGISTRY').count()).toBN()
    }

    checkProxyExists = async (address: string): Promise<string | null> => {
      const count = (await this.proxyCount()).toNumber()
      for (let i = 1; i < count; i += 1) {
        const accessToken = i.toString()
        const ownerBN = await this.getProxyAccessTokenOwner(accessToken)
        if (ownerBN && ethers.utils.getAddress(ownerBN.toString()) === ethers.utils.getAddress(address)) {
          return await this.getProxy(accessToken)
        }
      }
      return null
    }

    proxyCreateNew = async (address: string) => {
      const accessToken = await this.buildProxy(address)
      console.log('accessToken', accessToken)
      const proxy = await this.getProxy(accessToken)
      console.log('new proxy', proxy)
      return proxy
    }

    proxyIssue = async (proxyAddress: string, nftRegistryAddress: string, tokenId: string) => {
      const proxy = this.contract('PROXY', proxyAddress)
      const encoded = abiCoder.encodeFunctionCall(
        {
          name: 'issue',
          type: 'function',
          inputs: [
            { type: 'address', name: 'shelf' },
            { type: 'address', name: 'registry' },
            { type: 'uint256', name: 'token' },
          ],
        },
        [this.contract('SHELF').address, nftRegistryAddress, tokenId]
      )

      return this.pending(proxy.execute(this.contract('ACTIONS').address, encoded))
    }

    proxyTransferIssue = async (proxyAddress: string, nftRegistryAddress: string, tokenId: string) => {
      const proxy = this.contract('PROXY', proxyAddress)
      const encoded = abiCoder.encodeFunctionCall(
        {
          name: 'transferIssue',
          type: 'function',
          inputs: [
            { type: 'address', name: 'shelf' },
            { type: 'address', name: 'registry' },
            { type: 'uint256', name: 'token' },
          ],
        },
        [this.contract('SHELF').address, nftRegistryAddress, tokenId]
      )

      return this.pending(proxy.execute(this.contract('ACTIONS').address, encoded))
    }

    proxyLockBorrowWithdraw = async (proxyAddress: string, loanId: string, amount: string, usr: string) => {
      const proxy = this.contract('PROXY', proxyAddress)
      const encoded = abiCoder.encodeFunctionCall(
        {
          name: 'lockBorrowWithdraw',
          type: 'function',
          inputs: [
            { type: 'address', name: 'shelf' },
            { type: 'uint256', name: 'loan' },
            { type: 'uint256', name: 'amount' },
            { type: 'address', name: 'usr' },
          ],
        },
        [this.contract('SHELF').address, loanId, amount, usr]
      )

      return this.pending(proxy.execute(this.contract('ACTIONS').address, encoded))
    }

    proxyRepayUnlockClose = async (proxyAddress: string, tokenId: string, loanId: string, registry: string) => {
      const proxy = this.contract('PROXY', proxyAddress)
      const encoded = abiCoder.encodeFunctionCall(
        {
          name: 'repayUnlockClose',
          type: 'function',
          inputs: [
            { type: 'address', name: 'shelf' },
            { type: 'address', name: 'pile' },
            { type: 'address', name: 'registry' },
            { type: 'uint256', name: 'token' },
            { type: 'address', name: 'erc20' },
            { type: 'uint256', name: 'loan' },
          ],
        },
        [
          this.contract('SHELF').address,
          this.contract('PILE').address,
          registry,
          tokenId,
          this.contract('TINLAKE_CURRENCY').address,
          loanId,
        ]
      )

      return this.pending(proxy.execute(this.contract('ACTIONS').address, encoded))
    }
  }
}

export type IProxyActions = {
  buildProxy(owner: string): Promise<any>
  checkProxyExists(address: string): Promise<string | null>
  getProxy(accessTokenId: string): Promise<any>
  proxyCount(): Promise<any>
  getProxyAccessToken(proxyAddr: string): Promise<any>
  getProxyAccessTokenOwner(tokenId: string): Promise<any>
  getProxyOwnerByLoan(loanId: string): Promise<any>
  getProxyOwnerByAddress(proxyAddr: string): Promise<any>
  proxyCreateNew(address: string): Promise<any>
  proxyIssue(proxyAddr: string, nftRegistryAddr: string, tokenId: string): Promise<PendingTransaction>
  proxyTransferIssue(proxyAddr: string, nftRegistryAddr: string, tokenId: string): Promise<PendingTransaction>
  proxyLockBorrowWithdraw(proxyAddr: string, loanId: string, amount: string, usr: string): Promise<any>
  proxyRepayUnlockClose(proxyAddr: string, tokenId: string, loanId: string, registry: string): Promise<any>
}

export default ProxyActions
