import { getNetworkIdIfExists } from './getNetworkIdIfExists';
import Docker from 'dockerode';

jest.mock('dockerode');

describe('getNetworkIdIfExists', () => {
  let mockDocker: jest.Mocked<Docker>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockDocker = new Docker() as jest.Mocked<Docker>;
    (Docker as jest.MockedClass<typeof Docker>).mockClear();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const networkName = '::network-name::';
  const networkId = '::network-id::';

  it('should return network id when network exists', async () => {
    const mockNetwork = {
      Name: networkName,
      Id: networkId,
    };
    mockDocker.listNetworks = jest.fn().mockResolvedValue([mockNetwork]);

    const result = await getNetworkIdIfExists(mockDocker, networkName);
    console.log({ result });
    expect(result).toBe(networkId);
    expect(mockDocker.listNetworks).toHaveBeenCalledWith({
      filters: { name: [networkName] },
    });
  });

  it('should return null when network does not exist', async () => {
    mockDocker.listNetworks = jest.fn().mockResolvedValue([]);

    const result = await getNetworkIdIfExists(mockDocker, networkName);
    
    expect(result).toBeNull();
    expect(mockDocker.listNetworks).toHaveBeenCalledWith({
      filters: { name: [networkName] },
    });
  });

  it('should handle errors and return null', async () => {
    const errorMessage = '::error-message::';
    const error = new Error(errorMessage);
    mockDocker.listNetworks = jest.fn().mockRejectedValue(error);

    let result = null;
    try {
      result = await getNetworkIdIfExists(mockDocker, networkName);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(errorMessage);
        expect(result).toBeNull();
        expect(mockDocker.listNetworks).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error checking for network existence:",
            error
          );
      }
    }
  });
}); 