import Docker from "dockerode";
import { NodeConfig } from "../types";
import { resolve } from "path";
import "dotenv/config";

const NETWORK_FOLDER_PATH = process.env.NETWORK_FOLDER_PATH;

export async function startBesuNode(docker: Docker, config: NodeConfig) {
  const absoluteHostNetworkPath = resolve(
    process.cwd(),
    `${NETWORK_FOLDER_PATH}`
  );

  const container = await docker.createContainer({
    Image: "hyperledger/besu:latest",
    name: config.name,
    ExposedPorts: {
      "8545/tcp": {},
      "8546/tcp": {},
      "30303/tcp": {},
    },
    HostConfig: {
      PortBindings: {
        "8545/tcp": [{ HostPort: `${config.rpcPort}` }],
        "30303/tcp": [{ HostPort: `${config.port}` }],
      },
      Binds: [
        `${absoluteHostNetworkPath}/${config.name}/data:/data`,
        `${absoluteHostNetworkPath}/genesis.json:/var/lib/besu/genesis.json`,
      ],
    },
    Cmd: [
      "--genesis-file=/var/lib/besu/genesis.json",
      "--miner-enabled=true",
      `--miner-coinbase=${config.validatorAddress}`,
      "--rpc-http-enabled",
      "--rpc-http-api=ETH,NET,CLIQUE",
      "--host-allowlist=*",
      "--bootnodes=enode://...",
    ],
  });

  await container.start();
  return container;
}
