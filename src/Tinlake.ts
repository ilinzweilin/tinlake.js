import Eth from 'ethjs';
import { ethI, executeAndRetry, ZERO_ADDRESS }  from './services/ethereum';
import  abiDefinitions  from './abi';

const contractNames = [
  'TINLAKE_CURRENCY',
  'JUNIOR_OPERATOR',
  'JUNIOR',
  'JUNIOR_TOKEN',
  'SENIOR',
  'SENIOR_TOKEN',
  'SENIOR_OPERATOR',
  'DISTRIBUTOR',
  'ASSESSOR',
  'TITLE',
  'PILE',
  'SHELF',
  'CEILING',
  'COLLECTOR',
  'THRESHOLD',
  'PRICE_POOL',
  'COLLATERAL_NFT',
  'COLLATERAL_NFT_DATA',
  'ROOT_CONTRACT',
  'PROXY',
  'PROXY_REGISTRY',
  'ACTIONS',
  'BORROWER_DEPLOYER',
  'LENDER_DEPLOYER'
];

type AbiOutput = {
  name: string;
  type: 'address' | 'uint256';
};

export type EthConfig = {
  from: string;
  gasLimit: string;
};

export type ContractNames = typeof contractNames[number];

export type Contracts = {
  [key in ContractNames]?: any;
};

export type ContractAbis = {
  [key in ContractNames]?: any;
};

export type ContractAddresses = {
  [key in ContractNames]?: string;
};

export type TinlakeParams = {
  provider: any;
  contractAddresses: ContractAddresses;
  nftDataOutputs: AbiOutput;
  transactionTimeout: number;
  contractAbis?: ContractAbis |{};
  ethConfig?: EthConfig | {};
  ethOptions?: any | {};
  contracts?: Contracts | {};
};

export type Constructor<T = {}> = new (...args: any[]) => Tinlake;

export default class Tinlake {
  public provider: any;
  public eth: ethI;
  public ethOptions: any;
  public ethConfig: EthConfig | {};
  public contractAddresses: ContractAddresses;
  public transactionTimeout: number;
  public contracts: Contracts = {};
  public contractAbis: ContractAbis = {};

  constructor(params: TinlakeParams) {
    const { provider, contractAddresses, transactionTimeout, contractAbis, ethOptions, ethConfig } = params;
    if (!contractAbis) {
      contractNames.forEach((name) => {
        if (abiDefinitions[name]) {
          this.contractAbis[name] = abiDefinitions[name];
        }
      });
    } else {
      this.contractAbis = contractAbis;
    }

    this.contractAddresses = contractAddresses;
    this.transactionTimeout = transactionTimeout;
    this.setProvider(provider, ethOptions);
    this.setEthConfig(ethConfig || {});
  }

  setProvider = (provider: any, ethOptions?: any) => {
    this.provider = provider;
    this.ethOptions = ethOptions || {};
    this.eth = new Eth(this.provider, this.ethOptions) as ethI;

    // set root & proxy contracts
    contractNames.forEach((name) => {
      if (this.contractAbis[name] && this.contractAddresses[name]) {
        this.contracts[name] = this.eth.contract(this.contractAbis[name])
        .at(this.contractAddresses[name]);
      }
    });
  }

  setEthConfig = (ethConfig: EthConfig | {}) => {
    this.ethConfig = ethConfig;
  }

  // retrieves contract addresses based on the root address provided 
  setContractAddresses = async () => {
    // retrieve borrower & lender deployer addresses
    this.contractAddresses['LENDER_DEPLOYER'] = (await executeAndRetry(this.contracts['ROOT_CONTRACT'].lenderDeployer, []))[0];
    this.contractAddresses['BORROWER_DEPLOYER'] = (await executeAndRetry(this.contracts['ROOT_CONTRACT'].borrowerDeployer, []))[0];
    const lenderDeployer = this.eth.contract(this.contractAbis['LENDER_DEPLOYER']).at(this.contractAddresses['LENDER_DEPLOYER']);
    const borrowerDeployer = this.eth.contract(this.contractAbis['BORROWER_DEPLOYER']).at(this.contractAddresses['BORROWER_DEPLOYER']); 

    // retrieve borrower addresses & create contracts
    // use shelf to retrieve borrowersite addresses for this deployment
    this.contractAddresses['SHELF'] = (await executeAndRetry(borrowerDeployer.shelf, []))[0];
    this.contracts['SHELF'] = this.eth.contract(this.contractAbis['SHELF']).at(this.contractAddresses['SHELF']);

    this.contractAddresses['COLLECTOR'] = (await executeAndRetry(borrowerDeployer.collector, []))[0];
    this.contracts['COLLECTOR'] = this.eth.contract(this.contractAbis['COLLECTOR']).at(this.contractAddresses['COLLECTOR']);
    this.contractAddresses['THRESHOLD'] = (await executeAndRetry(borrowerDeployer.threshold, []))[0];
    this.contracts['THRESHOLD'] = this.eth.contract(this.contractAbis['THRESHOLD']).at(this.contractAddresses['THRESHOLD']);
    this.contractAddresses['PRICE_POOL'] = (await executeAndRetry(borrowerDeployer.pricePool, []))[0];
    this.contracts['PRICE_POOL'] = this.eth.contract(this.contractAbis['PRICE_POOL']).at(this.contractAddresses['PRICE_POOL']);
    this.contractAddresses['TITLE'] = (await executeAndRetry(this.contracts['SHELF'].title, []))[0];
    this.contracts['TITLE'] = this.eth.contract(this.contractAbis['TITLE']).at(this.contractAddresses['TITLE']);
    this.contractAddresses['CEILING'] = (await executeAndRetry(this.contracts['SHELF'].ceiling, []))[0];
    this.contracts['CEILING'] = this.eth.contract(this.contractAbis['CEILING']).at(this.contractAddresses['CEILING']);
    this.contractAddresses['PILE'] = (await executeAndRetry(this.contracts['SHELF'].pile, []))[0];
    this.contracts['PILE'] = this.eth.contract(this.contractAbis['PILE']).at(this.contractAddresses['PILE']);
    this.contractAddresses['TINLAKE_CURRENCY']  = (await executeAndRetry(this.contracts['SHELF'].currency, []))[0];
    this.contracts['TINLAKE_CURRENCY'] = this.eth.contract(this.contractAbis['TINLAKE_CURRENCY']).at(this.contractAddresses['TINLAKE_CURRENCY']);
    this.contractAddresses['DISTRIBUTOR']  = (await executeAndRetry(this.contracts['SHELF'].distributor, []))[0];
    this.contracts['DISTRIBUTOR'] = this.eth.contract(this.contractAbis['DISTRIBUTOR']).at(this.contractAddresses['DISTRIBUTOR']);

    // retrieve lender addresses & create contract
    // use tranche operators to retrieve retrieve lender site addresses for this deployment (if possible)
    this.contractAddresses['JUNIOR_OPERATOR'] = (await executeAndRetry(lenderDeployer.juniorOperator, []))[0];
    this.contracts['JUNIOR_OPERATOR'] = this.eth.contract(this.contractAbis['JUNIOR_OPERATOR']).at(this.contractAddresses['JUNIOR_OPERATOR']);
    this.contractAddresses['JUNIOR'] = (await executeAndRetry(this.contracts['JUNIOR_OPERATOR'].tranche, []))[0];
    this.contracts['JUNIOR'] = this.eth.contract(this.contractAbis['JUNIOR']).at(this.contractAddresses['JUNIOR']);
    this.contractAddresses['JUNIOR_TOKEN'] = (await executeAndRetry(this.contracts['JUNIOR'].token, []))[0];
    this.contracts['JUNIOR_TOKEN'] = this.eth.contract(this.contractAbis['JUNIOR_TOKEN']).at(this.contractAddresses['JUNIOR_TOKEN']);

    this.contractAddresses['ASSESSOR'] = (await executeAndRetry(this.contracts['JUNIOR_OPERATOR'].assessor, []))[0];
    this.contracts['ASSESSOR'] = this.eth.contract(this.contractAbis['ASSESSOR']).at(this.contractAddresses['ASSESSOR']);
    
    // make sure senior tranche exists
    this.contractAddresses['SENIOR_OPERATOR'] = (await executeAndRetry(lenderDeployer.seniorOperator, []))[0];
    if (this.contractAddresses['SENIOR_OPERATOR'] !== ZERO_ADDRESS) {
      this.contracts['SENIOR_OPERATOR'] = this.eth.contract(this.contractAbis['SENIOR_OPERATOR']).at(this.contractAddresses['SENIOR_OPERATOR']);
      this.contractAddresses['SENIOR'] = (await executeAndRetry(this.contracts['SENIOR_OPERATOR'].tranche, []))[0];
      this.contracts['SENIOR'] = this.eth.contract(this.contractAbis['SENIOR']).at(this.contractAddresses['SENIOR']);
      this.contractAddresses['SENIOR_TOKEN'] = (await executeAndRetry(this.contracts['SENIOR'].token, []))[0];
      this.contracts['SENIOR_TOKEN'] = this.eth.contract(this.contractAbis['SENIOR']).at(this.contractAddresses['SENIOR_TOKEN']);
    } else {
      this.contractAddresses['SENIOR'] = ZERO_ADDRESS;
      this.contractAddresses['SENIOR_TOKEN'] = ZERO_ADDRESS;
    }
  }


}
