import { exec as execMocked } from "child_process";
import { removeBesuNetworkFiles } from "./removeBesuNetworkFiles";

// Mock the child_process module
jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("removeBesuNetworkFiles", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully remove besu network files", async () => {
    // Mock successful execution
    (execMocked as unknown as jest.Mock).mockImplementation(
      (command, callback) => {
        expect(command).toBe("sudo rm -rfv lib/besu/network/besu*");
        callback(
          null,
          "removed lib/besu/network/besu1\nremoved lib/besu/network/besu2",
          ""
        );
      }
    );

    const result = await removeBesuNetworkFiles();

    // Verify exec was called correctly
    expect(execMocked).toHaveBeenCalledWith(
      "sudo rm -rfv lib/besu/network/besu*",
      expect.any(Function)
    );

    // Verify the output
    expect(result).toBe(
      "removed lib/besu/network/besu1\nremoved lib/besu/network/besu2"
    );
  });

  test("should reject promise when error occurs", async () => {
    // Mock execution with error
    (execMocked as unknown as jest.Mock).mockImplementation(
      (command, callback) => {
        callback(new Error("Permission denied"), "", "Permission denied");
      }
    );

    // Ensure the promise is rejected
    await expect(removeBesuNetworkFiles()).rejects.toMatch(
      /Error: Permission denied/
    );

    // Verify exec was called
    expect(execMocked).toHaveBeenCalledWith(
      "sudo rm -rfv lib/besu/network/besu*",
      expect.any(Function)
    );
  });

  test("should reject promise when stderr is not empty", async () => {
    // Mock execution with stderr output
    (execMocked as unknown as jest.Mock).mockImplementation(
      (command, callback) => {
        callback(null, "", "Some error occurred");
      }
    );

    // Ensure the promise is rejected
    await expect(removeBesuNetworkFiles()).rejects.toMatch(
      /Error: Some error occurred/
    );

    // Verify exec was called
    expect(execMocked).toHaveBeenCalledWith(
      "sudo rm -rfv lib/besu/network/besu*",
      expect.any(Function)
    );
  });
});
