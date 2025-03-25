import Docker from "dockerode";
import { getNetworkIdIfExists } from "./getNetworkIdIfExists";
import { getContainersInNetwork } from "./getContainersInNetwork";

// Function to disconnect and stop a container
async function disconnectAndStopContainer(
  docker: Docker,
  networkId: string,
  containerId: string
): Promise<void> {
  try {
    const network = docker.getNetwork(networkId);
    const container = docker.getContainer(containerId);

    console.log({ container });

    // Disconnect container from network
    await network.disconnect({ Container: containerId });
    console.log(
      `Disconnected container ${containerId.substring(0, 12)} from network`
    );

    // Check if container is running
    const containerInfo = await container.inspect();
    if (containerInfo.State.Running) {
      // Stop the container
      await container.stop();
      console.log(`Stopped container ${containerId.substring(0, 12)}`);
    }

    await container.remove();
    console.log(`Removed container ${containerId.substring(0, 12)}`);
  } catch (error) {
    console.error(`Error handling container ${containerId}:`, error);
    throw error;
  }
}

// Function to delete a network
async function deleteNetwork(docker: Docker, networkId: string): Promise<void> {
  try {
    const network = docker.getNetwork(networkId);
    await network.remove();
    console.log(`Network ${networkId.substring(0, 12)} deleted successfully`);
  } catch (error) {
    console.error("Error deleting network:", error);
    throw error;
  }
}

// Function to create a simple Docker network
async function createNetwork(
  docker: Docker,
  networkName: string
): Promise<string> {
  try {
    const network = await docker.createNetwork({
      Name: networkName,
      Driver: "bridge",
      CheckDuplicate: true,
    });

    console.log(`Network "${networkName}" created successfully`);
    console.log(`Network ID: ${network.id}`);

    return network.id;
  } catch (error) {
    console.error("Error creating Docker network:", error);
    throw error;
  }
}

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
