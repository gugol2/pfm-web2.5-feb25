import fs from "fs/promises";
import path from "path";
import { readBesuPrivateKey } from "./readBesuPrivateKey"; // adjust path if needed
import { pickEnvVariable } from "./pickEnvVariable";

// Mock the dependencies
jest.mock("fs/promises");
jest.mock("./pickEnvVariable");

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPickEnvVariable = pickEnvVariable as jest.Mock;

describe("readBesuPrivateKey", () => {
  const networkFolderPath = "mockNetworkFolder";
  const dataPath = "mockDataPath";
  const keyFileContent = "PRIVATE_KEY_CONTENT";
  const expectedFilePath = path.join(
    process.cwd(),
    networkFolderPath,
    dataPath,
    "data",
    "key"
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockedPickEnvVariable.mockReturnValue(networkFolderPath);
  });

  it("should read the private key successfully on first try", async () => {
    mockedFs.readFile.mockResolvedValueOnce(keyFileContent);

    const result = await readBesuPrivateKey(dataPath);

    expect(mockedPickEnvVariable).toHaveBeenCalledWith("NETWORK_FOLDER_PATH");
    expect(mockedFs.readFile).toHaveBeenCalledTimes(1);
    expect(mockedFs.readFile).toHaveBeenCalledWith(expectedFilePath, "utf-8");
    expect(result).toBe(keyFileContent);
  });

  it("should retry and eventually succeed", async () => {
    // Fail twice then succeed
    mockedFs.readFile
      .mockRejectedValueOnce(new Error("File not found"))
      .mockRejectedValueOnce(new Error("File still not found"))
      .mockResolvedValueOnce(keyFileContent);

    const retries = 5;
    const result = await readBesuPrivateKey(dataPath, "utf-8", retries, 1); // Lower retryDelay for fast test

    expect(mockedFs.readFile).toHaveBeenCalledTimes(3);
    expect(result).toBe(keyFileContent);
  });

  it("should fail after max retries", async () => {
    mockedFs.readFile.mockRejectedValue(new Error("Still failing"));

    const retries = 3;
    const result = await expect(
      readBesuPrivateKey(dataPath, "utf-8", retries, 1)
    ).rejects.toThrow(`Failed to read file after ${retries} attempts`);

    expect(mockedFs.readFile).toHaveBeenCalledTimes(retries);
    expect(result).toBeUndefined();
  });
});
