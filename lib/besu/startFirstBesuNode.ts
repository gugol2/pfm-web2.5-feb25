import Docker from "dockerode";
import { resolve } from "path";
import "dotenv/config";

const NETWORK_FOLDER_PATH = process.env.NETWORK_FOLDER_PATH;

const startFirstBesuNode = async (docker: Docker, containerName: string) => {
  const dataVolumePath = resolve(
    process.cwd(),
    `${NETWORK_FOLDER_PATH}/${containerName}/data`
  );

  const container = await docker.createContainer({
    Image: "hyperledger/besu:latest",
    name: containerName,
    HostConfig: {
      AutoRemove: true, // Equivalent to --rm
      Binds: [`${dataVolumePath}:/data`],
    },
    Cmd: [
      "--data-path=/data",
      "public-key",
      "export-address",
      "--to=/data/node1Address",
    ],
  });

  await container.start();
  return container;
};

export { startFirstBesuNode };
