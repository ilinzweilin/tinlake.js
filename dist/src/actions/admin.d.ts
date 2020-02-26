import { Constructor, Tinlake, ContractNames } from '../types';
import BN from 'bn.js';
declare function AdminActions<ActionsBase extends Constructor<Tinlake>>(Base: ActionsBase): {
    new (...args: any[]): {
        isWard: (user: string, contractName: string) => Promise<BN>;
        canSetCeiling: (user: string) => Promise<boolean>;
        canSetInterestRate: (user: string) => Promise<boolean>;
        canSetJuniorTrancheInterest: (user: string) => Promise<boolean>;
        canSetSeniorTrancheInterest: (user: string) => Promise<boolean>;
        canSetEquityRatio: (user: string) => Promise<boolean>;
        canSetRiskScore: (user: string) => Promise<boolean>;
        canSetInvestorAllowance: (user: string) => Promise<boolean>;
        canSetThreshold: (user: string) => Promise<boolean>;
        canSetLoanPrice: (user: string) => Promise<boolean>;
        setCeiling: (loanId: string, amount: string) => Promise<unknown>;
        existsRateGroup: (rate: string) => Promise<boolean>;
        initRate: (rate: string) => Promise<unknown>;
        changeRate: (loan: string, rate: string) => Promise<unknown>;
        setRate: (loan: string, rate: string) => Promise<unknown>;
        approveAllowance: (user: string, maxCurrency: string, maxToken: string) => Promise<unknown>;
        provider: any;
        eth: import("../types").ethI;
        ethOptions: any;
        ethConfig: any;
        contractAddresses: import("../types").ContractAddresses;
        transactionTimeout: number;
        contracts: import("../types").Contracts;
        contractAbis: import("../types").ContractAbis;
    };
} & ActionsBase;
export declare type IAdminActions = {
    isWard(user: string, contractName: ContractNames): Promise<BN>;
    canSetCeiling(user: string): Promise<boolean>;
    canSetInterestRate(user: string): Promise<boolean>;
    canSetJuniorTrancheInterest(user: string): Promise<boolean>;
    canSetSeniorTrancheInterest(user: string): Promise<boolean>;
    canSetEquityRatio(user: string): Promise<boolean>;
    canSetRiskScore(user: string): Promise<boolean>;
    canSetInvestorAllowance(user: string): Promise<boolean>;
    canSetThreshold(user: string): Promise<boolean>;
    canSetLoanPrice(user: string): Promise<boolean>;
    setCeiling(loanId: string, amount: string): Promise<any>;
    initRate(rate: string, speed: string): Promise<any>;
    setRate(loan: string, rate: string): Promise<any>;
    approveAllowance(user: string, maxCurrency: string, maxToken: string): Promise<any>;
};
export default AdminActions;
