import Docker from "dockerode";

// Function to delete a network
export async function deleteNetwork(docker: Docker, networkId: string): Promise<void> {
  try {
    const network = docker.getNetwork(networkId);
    await network.remove();
    console.log(`Network ${networkId.substring(0, 12)} deleted successfully`);
  } catch (error) {
    console.error("Error deleting network:", error);
    throw error;
  }
}

