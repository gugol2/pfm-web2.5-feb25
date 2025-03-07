import Docker from "dockerode";
import { resolve } from "path";
import { pickEnvVariable } from "./pickEnvVariable.js";

const startFirstBesuNode = async (docker: Docker, containerName: string) => {
  const networkFolderPath = pickEnvVariable("NETWORK_FOLDER_PATH");

  const dataVolumePath = resolve(
    process.cwd(),
    `${networkFolderPath}/${containerName}/data`
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
