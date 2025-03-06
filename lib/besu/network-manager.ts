import { initDocker } from "../docker/initDocker.js";
import { startBesuNode } from "./startBesuNode.js";
import { NodeConfig } from "../types";
import { createGenesisFile } from "./createGenesisFile.js";
import { generateKeyPair } from "./generateKeyPair.js";

const initializeNetwork = async (config: {
  nodeCount: number;
  chainId: number;
  blockPeriod: number;
  emptyblocks?: boolean;
}) => {
  let nodes: NodeConfig[] = [];

  // Generate validator keys
  const validators = await Promise.all(
    Array(config.nodeCount).fill(0).map(generateKeyPair)
  );

  // Create genesis file
  createGenesisFile({
    chainId: config.chainId,
    period: config.blockPeriod,
    validators: validators.map((v) => v.address),
    createemptyblocks: config.emptyblocks ?? true,
  });

  // Configure nodes
  nodes = validators.map((v, i) => ({
    name: `besu-node-${i}`,
    port: 30303 + i,
    rpcPort: 8545 + i,
    validatorAddress: v.address,
    key: v.privateKey,
  }));

  return nodes;
};

const startAllNodes = async (nodes: NodeConfig[]) => {
  const docker = initDocker();
  return Promise.all(nodes.map((node) => startBesuNode(docker, node)));
};

export const createNetwork = async () => {
  const configuratedNodes = await initializeNetwork({
    nodeCount: 3,
    chainId: 1337,
    blockPeriod: 15,
    emptyblocks: false, // Optional: Set to true to create empty blocks
  });

  console.log({ configuratedNodes });

  await startAllNodes(configuratedNodes);
};
