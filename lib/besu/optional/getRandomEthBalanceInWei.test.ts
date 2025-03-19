import { getRandomEthBalanceInWei } from "./getRandomEthBalanceInWei";

describe("getRandomEthBalanceInWei", () => {
  it("should return a string that starts with 0x", () => {
    const result = getRandomEthBalanceInWei();
    expect(result.startsWith("0x")).toBe(true);
  });

  it("should return a valid hexadecimal value", () => {
    const result = getRandomEthBalanceInWei();
    // Remove the '0x' prefix and check if the remaining string is valid hex
    const hexPart = result.slice(2);
    const isValidHex = /^[0-9a-fA-F]+$/.test(hexPart);
    expect(isValidHex).toBe(true);
  });

  it("should generate different values on multiple calls", () => {
    const results = new Set();
    // Generate 10 values and check they're all unique
    for (let i = 0; i < 10; i++) {
      results.add(getRandomEthBalanceInWei());
    }
    // If all values are unique, the size of the Set will be 10
    expect(results.size).toBe(10);
  });

  it("should produce values convertible back to BigInt", () => {
    const result = getRandomEthBalanceInWei();
    // Should not throw when converting back to BigInt
    expect(() => BigInt(result)).not.toThrow();
  });

  it("should generate values within the expected range", () => {
    const result = getRandomEthBalanceInWei();
    const value = BigInt(result);
    const maxExpectedWei = 10n ** 36n;

    expect(value >= 0n).toBe(true);
    expect(value <= maxExpectedWei).toBe(true);
  });

  it("should never return negative values", () => {
    // Run multiple tests to increase confidence
    for (let i = 0; i < 100; i++) {
      const result = getRandomEthBalanceInWei();
      const value = BigInt(result);
      expect(value >= 0n).toBe(true);
    }
  });
});
