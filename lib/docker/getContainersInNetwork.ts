import Docker from "dockerode";

// Function to get containers connected to a network
export async function getContainersInNetwork(
  docker: Docker,
  networkName: string): Promise<Docker.ContainerInfo[]> {
  try {
    // List all containers (including stopped ones)
    const containers = await docker.listContainers({ all: true });

    // Filter containers that belong to the specified network
    const filteredContainers = [];

    for (const container of containers) {
      // Get detailed container info to check networks
      const containerDetails = await docker
        .getContainer(container.Id)
        .inspect();

      // Check if the container is connected to the specified network
      if (containerDetails.NetworkSettings.Networks &&
        containerDetails.NetworkSettings.Networks[networkName]) {
        filteredContainers.push(container);
      }
    }

    return filteredContainers;
  } catch (error) {
    console.error("Error fetching containers:", error);
    throw error;
  }
}
