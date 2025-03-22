import { NodeConfig } from "../types";
import { generateKeyPair } from "./generateKeyPair";

export const createNodesConfiguration = async (config: {
  nodeCount: number;
  chainId: number;
  blockPeriod: number;
  emptyblocks?: boolean;
}) => {
  let configuratedNodes: NodeConfig[] = [];

  // Generate validator keys
  const validators = await Promise.all(
    Array(config.nodeCount).fill(0).map(generateKeyPair)
  );

  // Configure nodes
  configuratedNodes = validators.map((v, i) => ({
    name: `besu-node-${i}`,
    rpcPort: 8545 + 10 * i,
    wsPort: 8546 + 10 * i,
    p2pPort: 30303 + 10 * i,
    address: v.address,
    privateKey: v.privateKey,
  }));

  return configuratedNodes;
};
