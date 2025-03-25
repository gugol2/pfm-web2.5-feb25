import Docker from "dockerode";

// Function to disconnect and stop a container
export async function disconnectAndStopContainer(
  docker: Docker,
  networkId: string,
  containerId: string): Promise<void> {
  try {
    const network = docker.getNetwork(networkId);
    const container = docker.getContainer(containerId);

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
