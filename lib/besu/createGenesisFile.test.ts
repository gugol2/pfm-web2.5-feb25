import { writeFileSync } from "fs";
import { resolve as resolvedMocked } from "path";
import { createGenesisFile } from "./createGenesisFile";
import { pickEnvVariable as pickEnvVariableMocked } from "./pickEnvVariable";

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("path", () => ({
  resolve: jest.fn(),
}));

jest.mock("./pickEnvVariable");

describe("genesis-generator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockedNetworkFolderPath = "/path/to/network";
  const mockedErrorMessage = "::mocked not existing env variable::";
  const config = {
    chainId: 1337,
    period: 15,
    validators: [
      "0x1111111111111111111111111111111111111111",
      "0x2222222222222222222222222222222222222222",
    ],
  };

  it("should generate the correct genesis JSON file", () => {
    (pickEnvVariableMocked as jest.Mock).mockImplementation(
      () => mockedNetworkFolderPath
    );

    (resolvedMocked as jest.Mock).mockImplementation(
      (_pwd, relativePath) => relativePath
    );

    createGenesisFile(config);

    expect(pickEnvVariableMocked).toHaveBeenCalledTimes(1);
    expect(pickEnvVariableMocked).toHaveBeenCalledWith("NETWORK_FOLDER_PATH");

    const expectedGenesis = {
      config: {
        chainId: 1337,
        berlinBlock: 0,
        clique: {
          blockperiodseconds: 15,
          epochlength: 30000,
          createemptyblocks: true,
        },
      },
      coinbase: "0x0000000000000000000000000000000000000000",
      difficulty: "0x1",
      extraData:
        "0x" +
        "0".repeat(64) +
        "0x1111111111111111111111111111111111111111" +
        "0x2222222222222222222222222222222222222222" +
        "0".repeat(130),
      gasLimit: "0xa00000",
      mixHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      nonce: "0x0",
      timestamp: "0x5c51a607",
      alloc: {
        "0x1111111111111111111111111111111111111111": {
          balance:
            "0x200000000000000000000000000000000000000000000000000000000000000",
        },
        "0x2222222222222222222222222222222222222222": {
          balance:
            "0x200000000000000000000000000000000000000000000000000000000000000",
        },
      },
    };

    expect(writeFileSync).toHaveBeenCalledWith(
      `${mockedNetworkFolderPath}/genesis.json`,
      JSON.stringify(expectedGenesis, null, 2)
    );
  });

  it("should throw an error if the picking of the env variable fails", async () => {
    (pickEnvVariableMocked as jest.Mock).mockImplementation(() => {
      throw new Error(mockedErrorMessage);
    });

    try {
      createGenesisFile(config);
      fail("Expected an error");
    } catch (e: any) {
      expect(e.message).toEqual(mockedErrorMessage);
    }
  });
});
