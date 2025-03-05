import { writeFileSync } from "fs";
import { createGenesisFile } from "./genesis-generator";

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

describe("genesis-generator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate the correct genesis JSON file", () => {
    const config = {
      chainId: 1337,
      period: 15,
      validators: [
        "0x1111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222",
      ],
    };

    createGenesisFile(config);

    const expectedGenesis = {
      config: {
        chainId: 1337,
        clique: {
          blockperiodseconds: 15,
          epochlength: 30000,
        },
      },
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
      coinbase: "0x0000000000000000000000000000000000000000",
      extraData:
        "0x" +
        "0".repeat(64) +
        "0x1111111111111111111111111111111111111111" +
        "0x2222222222222222222222222222222222222222" +
        "0".repeat(130),
      nonce: "0x0",
      timestamp: "0x5f95b113",
      gasLimit: "0x47b760",
    };

    expect(writeFileSync).toHaveBeenCalledWith(
      "./network/genesis.json",
      JSON.stringify(expectedGenesis, null, 2)
    );
  });
});
