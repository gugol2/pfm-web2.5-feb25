import Docker from "dockerode";

const getContainerIp = async (
  container: Docker.Container,
  networkName: string
): Promise<string> => {
  const containerInfo = await container.inspect();
  const containerIp =
    containerInfo?.NetworkSettings?.Networks?.[networkName]?.IPAddress;

  return containerIp;
};

export { getContainerIp };
