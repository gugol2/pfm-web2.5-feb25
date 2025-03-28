import Docker from "dockerode";
import { getNetworkIdIfExists } from "./getNetworkIdIfExists.js";
import { getContainersInNetwork } from "./getContainersInNetwork.js";
import { disconnectAndStopContainer } from "./disconnectAndStopContainer.js";
import { deleteNetwork } from "./deleteNetwork.js";
import { createNetwork } from "./createNetwork.js";

// Main function to handle the network operations
async function setupDockerNetwork(
  docker: Docker,
  networkName: string
): Promise<string> {
  try {
    // Check if network already exists
    const existingNetworkId = await getNetworkIdIfExists(docker, networkName);

    if (existingNetworkId) {
      console.log(
        `Network "${networkName}" already exists with ID ${existingNetworkId}`
      );

      const containers = await getContainersInNetwork(docker, networkName);

      // Disconnect and stop all containers in the network
      if (containers.length > 0) {
        console.log(
          `Found ${containers.length} containers connected to the network`
        );
        for (const container of containers) {
          await disconnectAndStopContainer(
            docker,
            existingNetworkId,
            container.Id
          );
        }
      } else {
        console.log("No containers connected to the network");
      }

      // Delete the existing network
      await deleteNetwork(docker, existingNetworkId);
    }

    // Create a new network
    const newNetworkId = await createNetwork(docker, networkName);
    return newNetworkId;
  } catch (error) {
    console.error("Error in setupNetwork:", error);
    throw error;
  }
}

export { setupDockerNetwork };
