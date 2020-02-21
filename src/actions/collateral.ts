import { Constructor, Tinlake  } from '../types';
import { waitAndReturnEvents, executeAndRetry } from '../ethereum';

function CollateralActions<ActionsBase extends Constructor<Tinlake>>(Base: ActionsBase) {
  return class extends Base implements ICollateralActions {

    mintNFT = async (user: string) => {
      const txHash = await executeAndRetry(this.contracts['COLLATERAL_NFT'].issue, [user, this.ethConfig]);
      console.log(`[Mint NFT] txHash: ${txHash}`);
      return waitAndReturnEvents(this.eth, txHash, this.contracts['COLLATERAL_NFT'].abi, this.transactionTimeout);
    }

    approveNFT = async (tokenId: string, to: string) => {
      const txHash = await executeAndRetry(this.contracts["COLLATERAL_NFT"].approve, [to, tokenId, this.ethConfig])
      console.log(`[NFT Approve] txHash: ${txHash}`);
      return waitAndReturnEvents(this.eth, txHash, this.contracts["COLLATERAL_NFT"].abi, this.transactionTimeout);
    }

  }
}

export type ICollateralActions = {
  mintNFT(usr: string, registry: string): Promise<any>
}

export default CollateralActions;
