import Docker from "dockerode";

// Function to check if a network exists and get its ID
async function getNetworkIdIfExists(
  docker: Docker,
  networkName: string): Promise<string | null> {
  try {
    const networks = await docker.listNetworks({
      filters: { name: [networkName] },
    });

    const network = networks.find((n) => n.Name === networkName);
    return network ? network.Id : null;
  } catch (error) {
    console.error("Error checking for network existence:", error);
    throw error;
  }
}

export { getNetworkIdIfExists };
