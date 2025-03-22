import { initDocker } from "../docker/initDocker.js";
import { createGenesisFile } from "./createGenesisFile.js";
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
import { getContainerIp } from "./getContainerIp.js";
import { createNodesConfiguration } from "./createNodesConfiguration.js";
import { validateBesuNetworkConfiguration } from "./validateBesuNetworkConfiguration.js";
import { pickEnvVariable } from "./pickEnvVariable.js";

export const createNetwork = async (
  nodeCount: number,
  emptyblocks: boolean = false
) => {
  const besuNetworkConfig = {
    nodeCount,
    chainId: parseInt(pickEnvVariable("CHAIN_ID")),
    blockPeriod: parseInt(pickEnvVariable("BLOCK_PERIOD")),
    emptyblocks,
  };

  try {
    // Validate the node configuration
    validateBesuNetworkConfiguration(besuNetworkConfig);

    const configuratedNodes = await createNodesConfiguration(besuNetworkConfig);

    await removeBesuNetworkFiles();

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
      chainId: besuNetworkConfig.chainId,
      period: besuNetworkConfig.blockPeriod,
      validators: configuratedNodes.map((cN) => ({
        address: cN.address,
        privateKey: cN.privateKey,
      })),
      createemptyblocks: besuNetworkConfig.emptyblocks ?? true,
    });

    await setupDockerNetwork(docker, "besu-clicke-network");

    const firstBootNode = await startBesuNode({
      docker,
      nodeConfig: configuratedNodes[0],
      networkName: "besu-clicke-network",
      networkId: 123,
    });

    console.log({ firstBootNode });

    const bootNodeIp = await getContainerIp(
      firstBootNode,
      "besu-clicke-network"
    );
    console.log({ bootNodeIp });

    const privateKey = await readBesuPrivateKey(configuratedNodes[0].name);

    console.log({ privateKey });
    const bootNodePublicKey = calculatePublicKeyForEnode(privateKey);
    const enode = `enode://${bootNodePublicKey}@${bootNodeIp}:${configuratedNodes[0].p2pPort}`;
    console.log({ enode });

    // OPTIONAL (anogher way to get the enode)
    // const enodeUrl = await waitForNodeAndGetEnode();
    // console.log({ enodeUrl });

    for (const nodeConfig of configuratedNodes.slice(1)) {
      const besuContainer = await startBesuNode({
        docker,
        nodeConfig,
        networkName: "besu-clicke-network",
        networkId: 123,
        enode,
      });

      console.log({ besuContainer });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    return;
  }
};
