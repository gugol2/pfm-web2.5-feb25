import Docker from "dockerode";
import { deleteNetwork } from "./deleteNetwork";
import { createConsoleErrorSpy } from '../test-utils/helpers';


// Mock Dockerode
jest.mock("dockerode");

describe("deleteNetwork", () => {
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
      getNetwork: jest.fn().mockReturnValue(mockNetwork),
    } as any;

    consoleErrorSpy = createConsoleErrorSpy(jest.fn((errorMessage, errorCode) => console.log(errorMessage)));
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
  });
  
  it("should successfully delete a network", async () => {
    const networkId = "test-network-id";
    mockNetwork.remove.mockResolvedValueOnce(undefined);

    await deleteNetwork(mockDocker, networkId);

    expect(mockDocker.getNetwork).toHaveBeenCalledWith(networkId);
    expect(mockNetwork.remove).toHaveBeenCalled();
  });

  it("should throw an error when network deletion fails", async () => {
    const networkId = "test-network-id";
    const error = new Error("Network deletion failed");
    mockNetwork.remove.mockRejectedValueOnce(error);

    await expect(deleteNetwork(mockDocker, networkId)).rejects.toThrow(error);
  });

  
}); 