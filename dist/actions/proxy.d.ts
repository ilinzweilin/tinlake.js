import { Constructor, TinlakeParams } from '../Tinlake';
import BN from 'bn.js';
export declare function ProxyActions<ActionsBase extends Constructor<TinlakeParams>>(Base: ActionsBase): {
    new (...args: any[]): {
        getProxyAccessTokenOwner: (tokenId: string) => Promise<BN>;
        buildProxy: (owner: string) => Promise<any>;
        getProxy: (accessTokenId: string) => Promise<any>;
        getProxyAccessToken: (proxyAddr: string) => Promise<any>;
        getProxyOwnerByLoan: (loanId: string) => Promise<BN>;
        proxyCount: () => Promise<BN>;
        checkProxyExists: (address: string) => Promise<string | null>;
        proxyCreateNew: (address: string) => Promise<any>;
        proxyTransferIssue: (proxyAddr: string, tokenId: string) => Promise<unknown>;
        proxyLockBorrowWithdraw: (proxyAddr: string, loanId: string, amount: string, usr: string) => Promise<unknown>;
        proxyRepayUnlockClose: (proxyAddr: string, tokenId: string, loanId: string) => Promise<unknown>;
        provider: any;
        eth: import("../services/ethereum").ethI;
        ethOptions: any;
        ethConfig: {} | import("../Tinlake").EthConfig;
        contractAddresses: import("../Tinlake").ContractAddresses;
        transactionTimeout: number;
        contracts: import("../Tinlake").Contracts;
        contractAbis: import("../Tinlake").ContractAbis;
        setProvider: (provider: any, ethOptions?: any) => void;
        setEthConfig: (ethConfig: {} | import("../Tinlake").EthConfig) => void;
    };
} & ActionsBase;
export declare type IProxyActions = {
    buildProxy(owner: string): Promise<any>;
    checkProxyExists(provider: any, address: string): Promise<string | null>;
    getProxy(accessTokenId: string): Promise<any>;
    proxyCount(): Promise<any>;
    getProxyAccessToken(proxyAddr: string): Promise<any>;
    getProxyAccessTokenOwner(tokenId: string): Promise<any>;
    getProxyOwnerByLoan(loanId: string): Promise<any>;
    proxyCreateNew(address: string): Promise<any>;
    proxyTransferIssue(proxyAddr: string, tokenId: string): Promise<any>;
    proxyLockBorrowWithdraw(proxyAddr: string, loanId: string, amount: string, usr: string): Promise<any>;
    proxyRepayUnlockClose(proxyAddr: string, tokenId: string, loanId: string): Promise<any>;
};
export default ProxyActions;
