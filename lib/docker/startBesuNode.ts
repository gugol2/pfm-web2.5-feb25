import Docker from "dockerode";

interface NodeConfig {
  name: string;
  port: number;
  rpcPort: number;
  validatorAddress: string;
}

export async function startBesuNode(docker: Docker, config: NodeConfig) {
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
        `./network/${config.name}/data:/var/lib/besu`,
        `./network/genesis.json:/var/lib/besu/genesis.json`,
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
