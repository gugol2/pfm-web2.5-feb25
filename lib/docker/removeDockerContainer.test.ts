import Docker from "dockerode";
import { removeDockerContainer } from "./removeDockerContainer";

// Mock the Docker module
jest.mock("dockerode");

describe("removeDockerContainer", () => {
  let mockDocker: jest.Mocked<Docker>;
  let mockContainer: any;
  const containerName = "test-container";

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create mock container with required methods
    mockContainer = {
      inspect: jest.fn(),
      stop: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    // Create mock Docker instance
    mockDocker = new Docker() as jest.Mocked<Docker>;
    mockDocker.getContainer = jest.fn().mockReturnValue(mockContainer);
  });

  test("should remove a running container", async () => {
    // Mock container as running
    mockContainer.inspect.mockResolvedValue({
      State: { Running: true },
      Name: containerName,
    });

    // Call the function to test
    await removeDockerContainer(mockDocker, containerName);

    // Verify the correct methods were called
    expect(mockDocker.getContainer).toHaveBeenCalledWith(containerName);
    expect(mockContainer.inspect).toHaveBeenCalled();
    expect(mockContainer.stop).toHaveBeenCalled();
    expect(mockContainer.remove).toHaveBeenCalled();
  });

  test("should remove a stopped container without trying to stop it", async () => {
    // Mock container as stopped
    mockContainer.inspect.mockResolvedValue({
      State: { Running: false },
      Name: containerName,
    });

    // Call the function to test
    await removeDockerContainer(mockDocker, containerName);

    // Verify the correct methods were called
    expect(mockDocker.getContainer).toHaveBeenCalledWith(containerName);
    expect(mockContainer.inspect).toHaveBeenCalled();
    expect(mockContainer.stop).not.toHaveBeenCalled();
    expect(mockContainer.remove).toHaveBeenCalled();
  });

  test("should handle case when container does not exist", async () => {
    // Mock inspect to throw an error (container doesn't exist)
    mockContainer.inspect.mockRejectedValue(new Error("Container not found"));

    // Spy on console.log
    const consoleSpy = jest.spyOn(console, "log");

    // Call the function to test
    await removeDockerContainer(mockDocker, containerName);

    // Verify the correct methods were called
    expect(mockDocker.getContainer).toHaveBeenCalledWith(containerName);
    expect(mockContainer.inspect).toHaveBeenCalled();
    expect(mockContainer.stop).not.toHaveBeenCalled();
    expect(mockContainer.remove).not.toHaveBeenCalled();

    // Verify the correct message was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      `No existing container named ${containerName} found.`
    );
  });
});
