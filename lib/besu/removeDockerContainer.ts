import Docker from "dockerode";

const removeDockerContainer = async (docker: Docker, containerName: string) => {
  // Check if a container with the same name already exists
  try {
    const existingContainer = docker.getContainer(containerName);
    const info = await existingContainer.inspect();

    if (info) {
      console.log(
        `Container ${containerName} already exists. Stopping and removing it.`
      );

      // Check if the container is running
      if (info.State.Running) {
        await existingContainer.stop();
      }

      // Remove the container
      await existingContainer.remove();
      console.log(`Container ${containerName} has been removed.`);
    }
  } catch (error) {
    // Container doesn't exist, which is fine
    console.log(`No existing container named ${containerName} found.`);
  }
};

export { removeDockerContainer };
