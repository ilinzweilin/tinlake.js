import { Constructor, TinlakeParams, PendingTransaction } from '../Tinlake';
import BN from 'bn.js';
export declare function CollateralActions<ActionsBase extends Constructor<TinlakeParams>>(Base: ActionsBase): {
    new (...args: any[]): {
        mintTitleNFT: (nftAddr: string, user: string) => Promise<any>;
        mintNFT: (nftAddr: string, owner: string, tokenId: string, ref: string, amount: string, asset: string) => Promise<{
            hash: any;
            contractKey: string;
        }>;
        approveNFT: (nftAddr: string, tokenId: string, to: string) => Promise<unknown>;
        setNFTApprovalForAll: (nftAddr: string, to: string, approved: boolean) => Promise<{
            hash: any;
            contractKey: string;
        }>;
        isNFTApprovedForAll: (nftAddr: string, owner: string, operator: string) => Promise<any>;
        getNFTCount: (nftAddr: string) => Promise<BN>;
        getNFTData: (nftAddr: string, tokenId: string) => Promise<any>;
        getNFTOwner: (nftAddr: string, tokenId: string) => Promise<BN>;
        transferNFT: (nftAddr: string, from: string, to: string, tokenId: string) => Promise<unknown>;
        provider: any;
        eth: import("../services/ethereum").ethI;
        ethOptions: any;
        ethConfig: import("../Tinlake").EthConfig;
        ethersConfig: import("../Tinlake").EthersConfig;
        contractAddresses: import("../Tinlake").ContractAddresses;
        transactionTimeout: number;
        contracts: import("../Tinlake").Contracts;
        ethersContracts: import("../Tinlake").Contracts;
        contractAbis: import("../Tinlake").ContractAbis;
        contractConfig: any;
        setProvider: (provider: any, ethOptions?: any) => void;
        setContracts: () => void;
        setEthConfig: (ethConfig: import("../Tinlake").EthConfig) => void;
        setEthersConfig: (ethersConfig: import("../Tinlake").EthersConfig | undefined) => void;
        createEthContract(address: string, abiName: string): void;
        createContract(address: string, abiName: string): import("ethers").Contract;
        getContract(address: string, abiName: string): import("ethers").Contract;
        getTransactionReceipt(tx: PendingTransaction): Promise<import("ethers/providers").TransactionReceipt>;
        getOperatorType: (tranche: string) => any;
    };
} & ActionsBase;
export declare type ICollateralActions = {
    mintTitleNFT(nftAddr: string, usr: string): Promise<any>;
    mintNFT(nftAddr: string, owner: string, tokenId: string, ref: string, amount: string, asset: string): Promise<PendingTransaction>;
    approveNFT(nftAddr: string, tokenId: string, to: string): Promise<any>;
    setNFTApprovalForAll(nftAddr: string, to: string, approved: boolean): Promise<unknown>;
    isNFTApprovedForAll(nftAddr: string, owner: string, operator: string): Promise<boolean>;
    getNFTCount(nftAddr: string): Promise<BN>;
    getNFTData(nftAddr: string, tokenId: string): Promise<any>;
    getNFTOwner(nftAddr: string, tokenId: string): Promise<BN>;
    transferNFT(nftAddr: string, from: string, to: string, tokenId: string): Promise<any>;
};
export default CollateralActions;
