import { readFile } from "fs/promises";
import { join as joinMocked } from "path";
import { readNodeAddressFromHost } from "./readNodeAddressFromHost";
import { pickEnvVariable as pickEnvVariableMocked } from "./pickEnvVariable";

// Mock dependencies
jest.mock("fs/promises");
jest.mock("path");
jest.mock("./pickEnvVariable");

describe("readNodeAddressFromHost", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.resetAllMocks();

    // Mock the join function to return a predictable path
    (joinMocked as jest.Mock).mockImplementation((...paths) => paths.join("/"));

    (pickEnvVariableMocked as jest.Mock).mockImplementation(
      () => mockedNetworkFolderPath
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedNetworkFolderPath = "::/path/to/network::";
  const mockedErrorMessage = "::mocked not existing env variable::";
  const containerName = "::containerName::";

  it("should read node address from file and return trimmed content", async () => {
    // Setup
    const expectedPath = `${mockedNetworkFolderPath}/${containerName}/data/node1Address`;
    const mockFileContent = "0x123abc  \n"; // Note trailing whitespace to test trim
    const expectedAddress = "0x123abc";

    // Mock readFile to return our test content
    (readFile as jest.Mock).mockResolvedValue(mockFileContent);

    // Execute
    const result = await readNodeAddressFromHost(containerName);

    // Verify
    expect(joinMocked).toHaveBeenCalledWith(
      mockedNetworkFolderPath,
      `${containerName}/data`,
      "node1Address"
    );
    expect(readFile).toHaveBeenCalledWith(expectedPath, "utf8");
    expect(result).toBe(expectedAddress);
  });

  it("should throw an error when NETWORK_FOLDER_PATH is not defined", async () => {
    (pickEnvVariableMocked as jest.Mock).mockImplementation(() => {
      throw new Error(mockedErrorMessage);
    });

    let result;
    try {
      result = await readNodeAddressFromHost(containerName);
      fail("Expected an error");
    } catch (e: any) {
      expect(e.message).toEqual(mockedErrorMessage);
      expect(result).toEqual(undefined);
      expect(readFile).not.toHaveBeenCalled();
    }
  });

  it("should propagate file read errors", async () => {
    // Setup
    const fileError = new Error("File not found");

    // Mock readFile to throw an error
    (readFile as jest.Mock).mockRejectedValue(fileError);

    // Execute & Verify
    await expect(readNodeAddressFromHost(containerName)).rejects.toThrow(
      fileError
    );
  });

  it("should construct the correct file path for different container names", async () => {
    // Setup
    const expectedPath = `${mockedNetworkFolderPath}/${containerName}/data/node1Address`;

    // Mock readFile
    const mockedAddress = "0xabc123 \n";
    (readFile as jest.Mock).mockResolvedValue(mockedAddress);

    // Execute
    const result = await readNodeAddressFromHost(containerName);

    // Verify path construction
    expect(joinMocked).toHaveBeenCalledWith(
      mockedNetworkFolderPath,
      `${containerName}/data`,
      "node1Address"
    );
    expect(readFile).toHaveBeenCalledWith(expectedPath, "utf8");
    expect(result).toBe(mockedAddress.trim());
  });
});
