import Docker from "dockerode";
import { getContainerIp } from "./getContainerIp";

// Mock Dockerode
jest.mock("dockerode");

describe("getContainerIp", () => {
  let mockContainer: Docker.Container;
  const networkName = "::networkName::";
  const networkNameTwo = "::networkNameTwo::";

  const expectedIp = "172.20.0.2";

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock container
    mockContainer = {
      inspect: jest.fn().mockResolvedValue({
        NetworkSettings: {
          Networks: {
            [networkName]: {
              IPAddress: expectedIp,
            },
            [networkNameTwo]: {
              IPAddress: "192.168.0.2",
            },
          },
        },
      }),
    } as unknown as Docker.Container;
  });

  it("should return the correct IP address for the specified network", async () => {
    const result = await getContainerIp(mockContainer, networkName);
    expect(result).toBe(expectedIp);
    expect(mockContainer.inspect).toHaveBeenCalledTimes(1);
  });

  it("should return undefined if the network does not exist", async () => {
    const nonExistentNetwork = "non-existent-network";
    const result = await getContainerIp(mockContainer, nonExistentNetwork);
    expect(result).toBeUndefined();
    expect(mockContainer.inspect).toHaveBeenCalledTimes(1);
  });

  it("should handle error when inspect fails", async () => {
    const errorMessage = "Container inspect failed";
    mockContainer.inspect = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    await expect(getContainerIp(mockContainer, networkName)).rejects.toThrow(
      errorMessage
    );
    expect(mockContainer.inspect).toHaveBeenCalledTimes(1);
  });

  it("should handle empty NetworkSettings", async () => {
    mockContainer.inspect = jest.fn().mockResolvedValue({
      NetworkSettings: {},
    });

    const result = await getContainerIp(mockContainer, networkName);
    expect(result).toBeUndefined();
  });

  it("should handle empty Networks object", async () => {
    mockContainer.inspect = jest.fn().mockResolvedValue({
      NetworkSettings: {
        Networks: {},
      },
    });

    const result = await getContainerIp(mockContainer, networkName);
    expect(result).toBeUndefined();
  });
});
