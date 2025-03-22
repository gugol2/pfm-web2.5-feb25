import { createNodesConfiguration } from "./createNodesConfiguration";
import { generateKeyPair } from "./generateKeyPair";

jest.mock("./generateKeyPair");

describe("createNodesConfiguration", () => {
  let mockKeyPairs: { address: string; privateKey: string }[];

  beforeEach(() => {
    jest.clearAllMocks();

    mockKeyPairs = Array(3)
      .fill(null)
      .map((_, i) => ({
        address: `0xAddress${i}`,
        privateKey: `PrivateKey${i}`,
      }));
    (generateKeyPair as jest.Mock)
      .mockResolvedValueOnce(mockKeyPairs[0])
      .mockResolvedValueOnce(mockKeyPairs[1])
      .mockResolvedValueOnce(mockKeyPairs[2]);
  });

  it("should generate the correct number of nodes with unique configurations", async () => {
    const config = {
      nodeCount: 3,
      chainId: 1337,
      blockPeriod: 5,
    };

    const result = await createNodesConfiguration(config);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      {
        name: "besu-node-0",
        rpcPort: 8545,
        wsPort: 8546,
        p2pPort: 30303,
        address: mockKeyPairs[0].address,
        privateKey: mockKeyPairs[0].privateKey,
      },
      {
        name: "besu-node-1",
        rpcPort: 8555,
        wsPort: 8556,
        p2pPort: 30313,
        address: mockKeyPairs[1].address,
        privateKey: mockKeyPairs[1].privateKey,
      },
      {
        name: "besu-node-2",
        rpcPort: 8565,
        wsPort: 8566,
        p2pPort: 30323,
        address: mockKeyPairs[2].address,
        privateKey: mockKeyPairs[2].privateKey,
      },
    ]);
  });

  it("should handle an emptyblocks property if provided", async () => {
    const config = {
      nodeCount: 1,
      chainId: 1337,
      blockPeriod: 5,
      emptyblocks: true,
    };

    const result = await createNodesConfiguration(config);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: "besu-node-0",
      rpcPort: 8545,
      wsPort: 8546,
      p2pPort: 30303,
      address: mockKeyPairs[0].address,
      privateKey: mockKeyPairs[0].privateKey,
    });
  });
});
