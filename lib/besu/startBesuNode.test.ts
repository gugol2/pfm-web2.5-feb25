import Dockerode from "dockerode";
import { startBesuNode } from "./startBesuNode";

describe("startBesuNode", () => {
  let createContainerMock: jest.Mock;
  let startMock: jest.Mock;
  let docker: Dockerode;

  beforeEach(() => {
    // Reset mocks before each test
    createContainerMock = jest.fn();
    startMock = jest.fn().mockResolvedValue(undefined);

    // Mock the returned container object
    createContainerMock.mockResolvedValue({
      start: startMock,
    });

    docker = {
      createContainer: createContainerMock,
    } as unknown as Dockerode;
  });

  it("should create and start a container with correct configuration", async () => {
    const config = {
      name: "test-node",
      port: 30303,
      rpcPort: 8545,
      validatorAddress: "0x1234567890abcdef",
    };

    const container = await startBesuNode(docker, config);

    expect(createContainerMock).toHaveBeenCalledWith({
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

    expect(startMock).toHaveBeenCalled(); // Ensure the container starts
    expect(container).toEqual({ start: startMock }); // Ensure it returns the mocked container
  });
});
