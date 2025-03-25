import Docker from "dockerode";

// Function to create a simple Docker network
export async function createNetwork(
  docker: Docker,
  networkName: string): Promise<string> {
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
