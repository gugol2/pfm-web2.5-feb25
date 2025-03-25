import Docker from 'dockerode';
import { setupDockerNetwork } from './setupDockerNetwork';
import { getNetworkIdIfExists } from './getNetworkIdIfExists';
import { getContainersInNetwork } from './getContainersInNetwork';
import { disconnectAndStopContainer } from './disconnectAndStopContainer';
import { deleteNetwork } from './deleteNetwork';
import { createNetwork } from './createNetwork';
import { createConsoleErrorSpy } from '../test-utils/helpers';


// Mock all imported functions
jest.mock('./getNetworkIdIfExists');
jest.mock('./getContainersInNetwork');
jest.mock('./disconnectAndStopContainer');
jest.mock('./deleteNetwork');
jest.mock('./createNetwork');

describe('setupDockerNetwork', () => {
  const mockDocker = {
    // Add any specific Docker methods you need to mock
  } as jest.Mocked<Docker>;
  const networkName = '::networkId::';
  const networkId = '::networkId::';
  const newNetworkId = '::newNetworkId::';
  const containerId = '::containerId::';
  let consoleErrorSpy: jest.SpyInstance;


  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    consoleErrorSpy = createConsoleErrorSpy(jest.fn((errorMessage, errorCode) => console.log(errorMessage)));
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
  });

  it('should create a new network when no network exists', async () => {
    // Mock getNetworkIdIfExists to return null (no existing network)
    (getNetworkIdIfExists as jest.Mock).mockResolvedValue(null);
    // Mock createNetwork to return a new network ID
    (createNetwork as jest.Mock).mockResolvedValue(newNetworkId);

    const result = await setupDockerNetwork(mockDocker, networkName);

    expect(getNetworkIdIfExists).toHaveBeenCalledWith(mockDocker, networkName);
    expect(getContainersInNetwork).not.toHaveBeenCalled();
    expect(disconnectAndStopContainer).not.toHaveBeenCalled();
    expect(deleteNetwork).not.toHaveBeenCalled();
    expect(createNetwork).toHaveBeenCalledWith(mockDocker, networkName);
    expect(result).toBe(newNetworkId);
  });

  it('should handle existing network with containers', async () => {
    // Mock existing network with containers
    (getNetworkIdIfExists as jest.Mock).mockResolvedValue(networkId);
    (getContainersInNetwork as jest.Mock).mockResolvedValue([{ Id: containerId }]);
    (createNetwork as jest.Mock).mockResolvedValue(newNetworkId);

    const result = await setupDockerNetwork(mockDocker, networkName);

    expect(getNetworkIdIfExists).toHaveBeenCalledWith(mockDocker, networkName);
    expect(getContainersInNetwork).toHaveBeenCalledWith(mockDocker, networkName);
    expect(disconnectAndStopContainer).toHaveBeenCalledWith(mockDocker, networkId, containerId);
    expect(deleteNetwork).toHaveBeenCalledWith(mockDocker, networkId);
    expect(createNetwork).toHaveBeenCalledWith(mockDocker, networkName);
    expect(result).toBe(newNetworkId);
  });

  it('should handle existing network without containers', async () => {
    // Mock existing network with no containers
    (getNetworkIdIfExists as jest.Mock).mockResolvedValue(networkId);
    (getContainersInNetwork as jest.Mock).mockResolvedValue([]);
    (createNetwork as jest.Mock).mockResolvedValue(newNetworkId);

    const result = await setupDockerNetwork(mockDocker, networkName);

    expect(getNetworkIdIfExists).toHaveBeenCalledWith(mockDocker, networkName);
    expect(getContainersInNetwork).toHaveBeenCalledWith(mockDocker, networkName);
    expect(disconnectAndStopContainer).not.toHaveBeenCalled();
    expect(deleteNetwork).toHaveBeenCalledWith(mockDocker, networkId);
    expect(createNetwork).toHaveBeenCalledWith(mockDocker, networkName);
    expect(result).toBe(newNetworkId);
  });

  it('should handle errors properly', async () => {
    const mockError = new Error('Test error');
    (getNetworkIdIfExists as jest.Mock).mockRejectedValue(mockError);

    await expect(setupDockerNetwork(mockDocker, networkName)).rejects.toThrow(mockError);
    expect(getNetworkIdIfExists).toHaveBeenCalledWith(mockDocker, networkName);
    expect(getContainersInNetwork).not.toHaveBeenCalled();
    expect(disconnectAndStopContainer).not.toHaveBeenCalled();
    expect(deleteNetwork).not.toHaveBeenCalled();
    expect(createNetwork).not.toHaveBeenCalled();
  });
}); 