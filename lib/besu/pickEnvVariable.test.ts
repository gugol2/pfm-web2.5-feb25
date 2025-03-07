import { pickEnvVariable } from "./pickEnvVariable";

describe("pickEnvVariable", () => {
  // Store the original process.env
  const originalEnv = process.env;

  beforeEach(() => {
    // Create a fresh copy of process.env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original process.env after each test
    process.env = originalEnv;
  });

  it("should return the correct environment variable value", () => {
    // Arrange
    process.env.TEST_NETWORK = "/path/to/network";

    // Act
    const result = pickEnvVariable("TEST_NETWORK");

    // Assert
    expect(result).toBe("/path/to/network");
  });

  it("should return the correct value for different network names", () => {
    // Arrange
    process.env.NETWORK_1 = "/path/network1";
    process.env.NETWORK_2 = "/path/network2";

    // Act & Assert
    expect(pickEnvVariable("NETWORK_1")).toBe("/path/network1");
    expect(pickEnvVariable("NETWORK_2")).toBe("/path/network2");
  });

  it("should throw an error when the network is not defined in env", () => {
    // Arrange - ensure the env variable doesn't exist
    delete process.env.UNDEFINED_NETWORK;

    // Act & Assert
    expect(() => {
      pickEnvVariable("UNDEFINED_NETWORK");
    }).toThrow("UNDEFINED_NETWORK is not defined in the .env file");
  });

  it("should throw an error with the correct message including the network name", () => {
    // Act & Assert
    expect(() => {
      pickEnvVariable("CUSTOM_NETWORK");
    }).toThrow("CUSTOM_NETWORK is not defined in the .env file");
  });
});
