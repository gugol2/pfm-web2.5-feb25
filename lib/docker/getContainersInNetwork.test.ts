import { getContainersInNetwork } from './getContainersInNetwork';
import Docker from 'dockerode';
import { createConsoleErrorSpy } from '../test-utils/helpers';

jest.mock('dockerode');

describe('getContainersInNetwork', () => {
  let mockDocker: jest.Mocked<Docker>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockDocker = new Docker() as jest.Mocked<Docker>;
    (Docker as jest.MockedClass<typeof Docker>).mockClear();
    consoleErrorSpy = createConsoleErrorSpy(jest.fn((errorMessage, errorCode) => console.log(errorMessage)));
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
  });

  const networkName = '::network-name::';
  const containerId1 = '::container-id-1::';
  const containerId2 = '::container-id-2::';

  it('should return containers connected to the specified network', async () => {
    // Mock container list
    const mockContainers = [
      { Id: containerId1, Name: 'container1' },
      { Id: containerId2, Name: 'container2' },
    ];
    mockDocker.listContainers = jest.fn().mockResolvedValue(mockContainers);

    // Mock container inspection for container1 (connected to network)
    const mockContainer1 = {
      getContainer: jest.fn().mockReturnThis(),
      inspect: jest.fn().mockResolvedValue({
        NetworkSettings: {
          Networks: {
            [networkName]: {
              NetworkID: '::network-id::',
              IPAddress: '172.17.0.2',
            },
          },
        },
      }),
    };

    // Mock container inspection for container2 (not connected to network)
    const mockContainer2 = {
      getContainer: jest.fn().mockReturnThis(),
      inspect: jest.fn().mockResolvedValue({
        NetworkSettings: {
          Networks: {
            'other-network': {
              NetworkID: '::other-network-id::',
              IPAddress: '172.17.0.3',
            },
          },
        },
      }),
    };

    mockDocker.getContainer = jest.fn().mockImplementation((id) => {
      if (id === containerId1) return mockContainer1;
      if (id === containerId2) return mockContainer2;
      throw new Error('Container not found');
    });

    const result = await getContainersInNetwork(mockDocker, networkName);

    expect(result).toHaveLength(1);
    expect(result[0].Id).toBe(containerId1);
    expect(mockDocker.listContainers).toHaveBeenCalledWith({ all: true });
    expect(mockDocker.getContainer).toHaveBeenCalledTimes(2);
    expect(mockContainer1.inspect).toHaveBeenCalled();
    expect(mockContainer2.inspect).toHaveBeenCalled();
  });

  it('should return empty array when no containers are connected to the network', async () => {
    const mockContainers = [
      { Id: containerId1, Name: 'container1' },
      { Id: containerId2, Name: 'container2' },
    ];
    mockDocker.listContainers = jest.fn().mockResolvedValue(mockContainers);

    // Mock container inspection for both containers (not connected to target network)
    const mockContainer = {
      getContainer: jest.fn().mockReturnThis(),
      inspect: jest.fn().mockResolvedValue({
        NetworkSettings: {
          Networks: {
            'other-network': {
              NetworkID: '::other-network-id::',
              IPAddress: '172.17.0.2',
            },
          },
        },
      }),
    };

    mockDocker.getContainer = jest.fn().mockReturnValue(mockContainer);

    const result = await getContainersInNetwork(mockDocker, networkName);

    expect(result).toHaveLength(0);
    expect(mockDocker.listContainers).toHaveBeenCalledWith({ all: true });
    expect(mockDocker.getContainer).toHaveBeenCalledTimes(2);
  });

  it('should handle errors and throw them', async () => {
    const errorMessage = '::error-message::';
    const error = new Error(errorMessage);
    
    mockDocker.listContainers = jest.fn().mockRejectedValue(error);

    await expect(getContainersInNetwork(mockDocker, networkName)).rejects.toThrow(errorMessage);
    expect(mockDocker.listContainers).toHaveBeenCalledWith({ all: true });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching containers:",
      error
    );
  });
}); 