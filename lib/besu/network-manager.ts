import { initDocker } from "../docker/initDocker.js";
import { startBesuNode } from "./startBesuNode.js";
import { NodeConfig } from "../types";
import { createGenesisFile } from "./createGenesisFile.js";
import { generateKeyPair } from "./generateKeyPair.js";
import { getAddressForFirstNode } from "./optional/getAddressForFirstNode.js";
import { setupDockerNetwork } from "../docker/setupDockerNetwork.js";
import { startFirstNodeAsBootNode } from "./startFirstNodeAsBootNode.js";
import {
  getEnodeInfo,
  waitForNodeAndGetEnode,
} from "./optional/getEnodeInfo.js";
import { calculatePublicKeyForEnode } from "./calculatePublicKeyForEnode.js";
import { removeDockerContainer } from "../docker/removeDockerContainer.js";
import { removeBesuNetworkFiles } from "./removeBesuNetworkFiles.js";
import { createBesuNodeFolderStructure } from "./optional/createBesuNodeFolderStructure.js";
import { readBesuPrivateKey } from "./readBesuPrivateKey.js";

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

  // Configure nodes
  nodes = validators.map((v, i) => ({
    name: `besu-node-${i}`,
    rpcPort: 8545 + i,
    wsPort: 8546 + i,
    p2pPort: 30303 + i,
    address: v.address,
    privateKey: v.privateKey,
  }));

  return nodes;
};

const startAllNodes = async (nodes: NodeConfig[]) => {
  const docker = initDocker();
  return Promise.all(nodes.map((node) => startBesuNode(docker, node)));
};

export const createNetwork = async () => {
  await removeBesuNetworkFiles();

  const config = {
    nodeCount: 3,
    chainId: 1337,
    blockPeriod: 15,
    emptyblocks: false, // Optional: Set to true to create empty blocks
  };

  const configuratedNodes = await initializeNetwork(config);

  console.log({ configuratedNodes });

  const docker = initDocker();

  // Remove all the nodes
  for (const nodeConfig of configuratedNodes) {
    await removeDockerContainer(docker, nodeConfig.name);
  }

  // optional: create the network folder structure
  // await createBesuNodeFolderStructure(
  //   `${configuratedNodes[0].name}/data`,
  //   "lib/besu/network/"
  // );

  // Pick the address of the first node (Optional)
  // const addressContainer = await getAddressForFirstNode(
  //   docker,
  //   "besu-node-address"
  // );

  // console.log({ addressContainer });

  // Create genesis file
  createGenesisFile({
    chainId: config.chainId,
    period: config.blockPeriod,
    validators: configuratedNodes.map((cN) => ({
      address: cN.address,
      privateKey: cN.privateKey,
    })),
    createemptyblocks: config.emptyblocks ?? true,
  });

  await setupDockerNetwork(docker, "besu-clicke-network");

  // await removeDockerContainer(docker, configuratedNodes[0].name);
  // await removeBesuNetworkFiles();

  const firstBootNode = await startFirstNodeAsBootNode(
    docker,
    configuratedNodes[0],
    "besu-clicke-network"
  );

  console.log({ firstBootNode });

  // Usage
  const privateKey = await readBesuPrivateKey(configuratedNodes[0].name);

  console.log({ privateKey });
  const bootNodePublicKey = calculatePublicKeyForEnode(privateKey);
  const enode = `${bootNodePublicKey}@127.0.0.1:${configuratedNodes[0].p2pPort}`;
  console.log({ enode });

  // OPTIONAL
  // const enodeUrl = await waitForNodeAndGetEnode();
  // console.log({ enodeUrl });

  // await startAllNodes(configuratedNodes);
};
