import Dockerode from "dockerode";
import { startBesuNode } from "./startBesuNode";
import { pickEnvVariable as pickEnvVariableMocked } from "./pickEnvVariable";
import { resolve as resolvedMocked } from "path";

jest.mock("path", () => ({
  resolve: jest.fn(),
}));

jest.mock("./pickEnvVariable");

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

    (resolvedMocked as jest.Mock).mockImplementation(
      (_pwd, relativePath) => relativePath
    );
  });

  const mockedNetworkFolderPath = "/path/to/network";
  const mockedErrorMessage = "::mocked not existing env variable::";

  const config = {
    name: "test-node",
    rpcPort: 8545,
    wsPort: 8546,
    p2pPort: 30303,
    address: "0x1234567890abcdef",
    privateKey: "0xabcdef123456",
  };

  it("should create and start a container with correct configuration", async () => {
    (pickEnvVariableMocked as jest.Mock).mockImplementation(
      () => mockedNetworkFolderPath
    );

    const container = await startBesuNode(docker, config);

    expect(pickEnvVariableMocked).toHaveBeenCalledTimes(1);
    expect(pickEnvVariableMocked).toHaveBeenCalledWith("NETWORK_FOLDER_PATH");

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
          "8546/tcp": [{ HostPort: `${config.wsPort}` }],
          "30303/tcp": [{ HostPort: `${config.p2pPort}` }],
        },
        Binds: [
          `${mockedNetworkFolderPath}/${config.name}/data:/data`,
          `${mockedNetworkFolderPath}/cliqueGenesis.json:/var/lib/besu/cliqueGenesis.json`,
        ],
      },
      Cmd: [
        "--genesis-file=/var/lib/besu/cliqueGenesis.json",
        "--miner-enabled=true",
        `--miner-coinbase=${config.address}`,
        "--rpc-http-enabled",
        "--rpc-http-api=ETH,NET,CLIQUE",
        "--host-allowlist=*",
        "--bootnodes=enode://...",
      ],
    });

    expect(startMock).toHaveBeenCalled(); // Ensure the container starts
    expect(container).toEqual({ start: startMock }); // Ensure it returns the mocked container
  });

  it("should throw an error if the picking of the env variable fails", async () => {
    (pickEnvVariableMocked as jest.Mock).mockImplementation(() => {
      throw new Error(mockedErrorMessage);
    });

    let container;
    try {
      container = await startBesuNode(docker, config);
      fail("Expected an error");
    } catch (e: any) {
      expect(e.message).toEqual(mockedErrorMessage);
      expect(container).toEqual(undefined);
      expect(startMock).not.toHaveBeenCalled();
    }
  });
});
