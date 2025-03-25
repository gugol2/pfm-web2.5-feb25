import Docker from "dockerode";
import { createConsoleErrorSpy } from '../test-utils/helpers';
import { createNetwork } from "./createNetwork";


// Mock Dockerode
jest.mock("dockerode");

describe("createNetwork", () => {
  let mockDocker: jest.Mocked<Docker>;
  let consoleErrorSpy: jest.SpyInstance;
  let mockNetwork: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock network
    mockNetwork = {
      remove: jest.fn(),
      id: "test-network-id",
    };
    // Setup mock Docker instance
    mockDocker = {
      createNetwork: jest.fn().mockResolvedValue(mockNetwork),
    } as any;

    consoleErrorSpy = createConsoleErrorSpy(jest.fn((errorMessage, errorCode) => console.log(errorMessage)));
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
  });
  
  it("should successfully create a network", async () => {
    const networkName = "test-network";
    const expectedNetworkId = "test-network-id";

    const result = await createNetwork(mockDocker, networkName);

    expect(mockDocker.createNetwork).toHaveBeenCalledWith({
      Name: networkName,
      Driver: "bridge",
      CheckDuplicate: true,
    });
    expect(result).toBe(expectedNetworkId);
  });

  it("should throw an error when network creation fails", async () => {
    const networkName = "test-network";
    const error = new Error("Network creation failed");
    mockDocker.createNetwork.mockRejectedValueOnce(error);

    await expect(createNetwork(mockDocker, networkName)).rejects.toThrow(error);
  });
}); 