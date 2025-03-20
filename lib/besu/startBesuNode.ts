import Docker from "dockerode";
import { resolve } from "path";
import { NodeConfig } from "../types/besu.types.js";
import { pickEnvVariable } from "./pickEnvVariable.js";

// Define Besu container configuration
const startBesuNode = async ({
  docker,
  nodeConfig,
  networkName,
  networkId,
  enode,
}: {
  docker: Docker;
  nodeConfig: NodeConfig;
  networkName: string;
  networkId?: number;
  enode?: string;
}) => {
  const networkFolderPath = pickEnvVariable("NETWORK_FOLDER_PATH");
  const absoluteHostNetworkPath = resolve(
    process.cwd(),
    `${networkFolderPath}`
  );

  let cmd = [
    "--data-path=/data",
    "--genesis-file=/config/cliqueGenesis.json",
    `--network-id=${networkId ?? 123}`,
    "--rpc-http-enabled",
    "--rpc-http-api=ETH,NET,CLIQUE,WEB3,ADMIN",
    "--host-allowlist=*",
    "--rpc-http-cors-origins=all",
    "--profile=ENTERPRISE",
  ];

  if (enode) {
    cmd = [...cmd, `--bootnodes=${enode}`];
  }

  console.log("Starting Besu node with parameters:", cmd);

  try {
    // Create a container
    const container = await docker.createContainer({
      Image: "hyperledger/besu:latest",
      name: nodeConfig.name,
      Cmd: cmd,
      HostConfig: {
        NetworkMode: networkName,
        Binds: [
          `${absoluteHostNetworkPath}/${nodeConfig.name}/data:/data`,
          `${absoluteHostNetworkPath}/cliqueGenesis.json:/config/cliqueGenesis.json`,
        ],
        PortBindings: {
          "8545/tcp": [{ HostPort: `${nodeConfig.rpcPort}` }],
          "8546/tcp": [{ HostPort: `${nodeConfig.wsPort}` }],
          "30303/tcp": [{ HostPort: `${nodeConfig.p2pPort}` }],
        },
      },
      ExposedPorts: {
        "8545/tcp": {},
        "8546/tcp": {},
        "30303/tcp": {},
      },
      Tty: true,
      AttachStdout: true,
      AttachStderr: true,
    });
    // Start the container
    await container.start();
    console.log("Besu node started successfully");
    // Optional: Log container output
    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });
    stream.pipe(process.stdout);
    return container;
  } catch (error) {
    console.error("Error starting Besu node:", error);
    throw error;
  }
};

export { startBesuNode };

// // Execute the function
// startBesuNode()
//   .then((container) => {
//     console.log(`Container started with ID: ${container.id}`);
//     // Optional: Setup cleanup on process exit
//     process.on("SIGINT", async () => {
//       console.log("Stopping container...");
//       await container.stop();
//       console.log("Container stopped");
//       process.exit();
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to run Besu node:", err);
//   });
//# sourceMappingURL=startBesuNode.js.map
