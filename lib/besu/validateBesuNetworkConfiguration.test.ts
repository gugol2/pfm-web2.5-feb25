import { validateBesuNetworkConfiguration } from "./validateBesuNetworkConfiguration";

describe("validateBesuNetworkConfiguration", () => {
  it("should throw an error if nodeCount is less than or equal to 0", () => {
    const invalidConfig = { nodeCount: 0, chainId: 1, blockPeriod: 1 };
    expect(() => validateBesuNetworkConfiguration(invalidConfig)).toThrow(
      "Invalid number of nodes. Please enter a positive integer lower than 10."
    );
  });

  it("should throw an error if nodeCount is greater than 9", () => {
    const invalidConfig = { nodeCount: 10, chainId: 1, blockPeriod: 1 };
    expect(() => validateBesuNetworkConfiguration(invalidConfig)).toThrow(
      "Invalid number of nodes. Please enter a positive integer lower than 10."
    );
  });

  it("should throw an error if chainId is less than or equal to 0", () => {
    const invalidConfig = { nodeCount: 5, chainId: 0, blockPeriod: 1 };
    expect(() => validateBesuNetworkConfiguration(invalidConfig)).toThrow(
      "Invalid chain ID. Please enter a positive integer."
    );
  });

  it("should throw an error if blockPeriod is less than or equal to 0", () => {
    const invalidConfig = { nodeCount: 5, chainId: 1, blockPeriod: 0 };
    expect(() => validateBesuNetworkConfiguration(invalidConfig)).toThrow(
      "Invalid block period. Please enter a positive integer."
    );
  });
});
