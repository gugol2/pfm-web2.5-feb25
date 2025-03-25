import Docker from "dockerode";
import { disconnectAndStopContainer } from "./disconnectAndStopContainer";
import { createConsoleErrorSpy } from '../test-utils/helpers';

// Mock Dockerode
jest.mock("dockerode");

describe("disconnectAndStopContainer", () => {
  let mockDocker: jest.Mocked<Docker>;
  let consoleErrorSpy: jest.SpyInstance;
  let mockNetwork: any;
  let mockContainer: any;
  const networkId = "test-network-id";
  const containerId = "test-container-id";

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    consoleErrorSpy= createConsoleErrorSpy(jest.fn((errorMessage, errorCode) => console.log(errorMessage)));

    // Setup mock container
    mockContainer = {
      inspect: jest.fn(),
      stop: jest.fn(),
      remove: jest.fn(),
    };

    // Setup mock network
    mockNetwork = {
      disconnect: jest.fn(),
    };

    // Setup mock Docker instance
    mockDocker = {
      getNetwork: jest.fn().mockReturnValue(mockNetwork),
      getContainer: jest.fn().mockReturnValue(mockContainer),
    } as any;
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
  });

  it("should disconnect container from network and stop it if running", async () => {
    // Mock container inspection to return running state
    mockContainer.inspect.mockResolvedValue({
      State: { Running: true },
    });

    await disconnectAndStopContainer(mockDocker, networkId, containerId);

    // Verify network disconnect was called
    expect(mockNetwork.disconnect).toHaveBeenCalledWith({
      Container: containerId,
    });

    // Verify container stop was called
    expect(mockContainer.stop).toHaveBeenCalled();

    // Verify container remove was called
    expect(mockContainer.remove).toHaveBeenCalled();
  });

  it("should disconnect container from network but not stop it if not running", async () => {
    // Mock container inspection to return stopped state
    mockContainer.inspect.mockResolvedValue({
      State: { Running: false },
    });

    await disconnectAndStopContainer(mockDocker, networkId, containerId);

    // Verify network disconnect was called
    expect(mockNetwork.disconnect).toHaveBeenCalledWith({
      Container: containerId,
    });

    // Verify container stop was NOT called
    expect(mockContainer.stop).not.toHaveBeenCalled();

    // Verify container remove was called
    expect(mockContainer.remove).toHaveBeenCalled();
  });

  it("should throw error if any operation fails", async () => {
    // Mock network disconnect to throw error
    mockNetwork.disconnect.mockRejectedValue(new Error("Network error"));

    await expect(
      disconnectAndStopContainer(mockDocker, networkId, containerId)
    ).rejects.toThrow("Network error");
  });
}); 