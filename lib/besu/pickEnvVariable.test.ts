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
    process.env.TEST_VARIABLE = "/path/to/varaiable";

    // Act
    const result = pickEnvVariable("TEST_VARIABLE");

    // Assert
    expect(result).toBe("/path/to/varaiable");
  });

  it("should return the correct value for different varaiable names", () => {
    // Arrange
    process.env.VARIABLE_1 = "/path/network1";
    process.env.VARIABLE_2 = "/path/network2";

    // Act & Assert
    expect(pickEnvVariable("VARIABLE_1")).toBe("/path/network1");
    expect(pickEnvVariable("VARIABLE_2")).toBe("/path/network2");
  });

  it("should throw an error when the varaiable is not defined in env", () => {
    // Arrange - ensure the env variable doesn't exist
    delete process.env.UNDEFINED_VARIABLE;

    // Act & Assert
    expect(() => {
      pickEnvVariable("UNDEFINED_VARIABLE");
    }).toThrow("UNDEFINED_VARIABLE is not defined in the .env file");
  });

  it("should throw an error with the correct message including the varaiable name", () => {
    // Act & Assert
    expect(() => {
      pickEnvVariable("CUSTOM_VARIABLE");
    }).toThrow("CUSTOM_VARIABLE is not defined in the .env file");
  });
});
