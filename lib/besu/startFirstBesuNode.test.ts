import Dockerode from "dockerode";
import { resolve as resolvedMocked } from "path";
import { pickEnvVariable as pickEnvVariableMocked } from "./pickEnvVariable";
import { startFirstBesuNode } from "./startFirstBesuNode";

jest.mock("path", () => ({
  resolve: jest.fn(),
}));

jest.mock("./pickEnvVariable");

describe("startFirstBesuNode", () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedNetworkFolderPath = "/path/to/network";
  const containerName = "::containerName::";
  const mockedErrorMessage = "::mocked not existing env variable::";

  it("should create and start a container with correct configuration", async () => {
    (pickEnvVariableMocked as jest.Mock).mockImplementation(
      () => mockedNetworkFolderPath
    );

    const container = await startFirstBesuNode(docker, containerName);

    expect(pickEnvVariableMocked).toHaveBeenCalledTimes(1);
    expect(pickEnvVariableMocked).toHaveBeenCalledWith("NETWORK_FOLDER_PATH");

    expect(createContainerMock).toHaveBeenCalledWith({
      Image: "hyperledger/besu:latest",
      name: containerName,

      HostConfig: {
        AutoRemove: true,
        Binds: [`${mockedNetworkFolderPath}/${containerName}/data:/data`],
      },
      Cmd: [
        "--data-path=/data",
        "public-key",
        "export-address",
        "--to=/data/node1Address",
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
      container = await startFirstBesuNode(docker, containerName);
      fail("Expected an error");
    } catch (e: any) {
      expect(e.message).toEqual(mockedErrorMessage);
      expect(container).toEqual(undefined);
      expect(startMock).not.toHaveBeenCalled();
    }
  });
});
