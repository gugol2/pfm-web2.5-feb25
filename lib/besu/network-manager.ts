import { initDocker } from "../docker/initDocker.js";
import { createGenesisFile } from "./createGenesisFile.js";
import { generateKeyPair } from "./generateKeyPair.js";
import { getAddressForFirstNode } from "./optional/getAddressForFirstNode.js";
import { setupDockerNetwork } from "../docker/setupDockerNetwork.js";
import { startBesuNode } from "./startBesuNode.js";
import {
  getEnodeInfo,
  waitForNodeAndGetEnode,
} from "./optional/getEnodeInfo.js";
import { calculatePublicKeyForEnode } from "./calculatePublicKeyForEnode.js";
import { removeDockerContainer } from "../docker/removeDockerContainer.js";
import { removeBesuNetworkFiles } from "./removeBesuNetworkFiles.js";
import { createBesuNodeFolderStructure } from "./optional/createBesuNodeFolderStructure.js";
import { readBesuPrivateKey } from "./readBesuPrivateKey.js";
import Docker from "dockerode";
import { NodeConfig } from "../types/besu.types.js";
import { getContainerIp } from "./getContainerIp.js";

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
    rpcPort: 8545 + 10 * i,
    wsPort: 8546 + 10 * i,
    p2pPort: 30303 + 10 * i,
    address: v.address,
    privateKey: v.privateKey,
  }));

  return nodes;
};

const startSlaveNodes = async (
  docker: Docker,
  nodes: NodeConfig[],
  enode: string
) => {
  for (const node of nodes) {
    const besuContainer = await startBesuNode({
      docker,
      nodeConfig: node,
      networkName: "besu-clicke-network",
      networkId: 123,
      enode,
    });

    console.log({ besuContainer });
  }
};

export const createNetwork = async (nodeCount: number) => {
  await removeBesuNetworkFiles();

  const config = {
    nodeCount,
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

  const firstBootNode = await startBesuNode({
    docker,
    nodeConfig: configuratedNodes[0],
    networkName: "besu-clicke-network",
    networkId: 123,
  });

  console.log({ firstBootNode });

  const bootNodeIp = await getContainerIp(firstBootNode, "besu-clicke-network");
  console.log({ bootNodeIp });

  // Usage
  const privateKey = await readBesuPrivateKey(configuratedNodes[0].name);

  console.log({ privateKey });
  const bootNodePublicKey = calculatePublicKeyForEnode(privateKey);
  const enode = `enode://${bootNodePublicKey}@${bootNodeIp}:${configuratedNodes[0].p2pPort}`;
  console.log({ enode });

  // OPTIONAL
  // const enodeUrl = await waitForNodeAndGetEnode();
  // console.log({ enodeUrl });

  await startSlaveNodes(docker, configuratedNodes.slice(1), enode);
};
