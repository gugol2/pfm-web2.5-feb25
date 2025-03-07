import Dockerode from "dockerode";
import { resolve as resolvedMocked } from "path";
import { startFirstBesuNode } from "./startFirstBesuNode";

jest.mock("path", () => ({
  resolve: jest.fn(),
}));

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

  test("reads env NETWORK_FOLDER_PATH variable", () => {
    expect(process.env.NETWORK_FOLDER_PATH).toBeDefined();
  });
  it("should create and start a container with correct configuration", async () => {
    const containerName = "::containerName::";

    const container = await startFirstBesuNode(docker, containerName);

    expect(createContainerMock).toHaveBeenCalledWith({
      Image: "hyperledger/besu:latest",
      name: containerName,

      HostConfig: {
        AutoRemove: true,
        Binds: [
          `${process.env.NETWORK_FOLDER_PATH}/${containerName}/data:/data`,
        ],
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
});
