export interface NodeConfig {
  name: string;
  p2pPort: number;
  rpcPort: number;
  wsPort: number;
  address: string;
  privateKey: string;
}

export interface BesuAddress {
  address: string;
  privateKey: string;
}

export interface BesuNetworkConfig {
  nodeCount: number;
  chainId: number;
  blockPeriod: number;
  emptyblocks?: boolean;
}
