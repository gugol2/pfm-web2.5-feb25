
import { runScript } from './runScript';
import { spawn } from 'child_process';


// Mock child_process.spawn
jest.mock('child_process', () => ({
  spawn: jest.fn()
}));

describe('runScript function', () => {
  let mockStdout: any;
  let mockStderr: any;
  let mockOn: any;
  let spawnMock: jest.Mock;
  
  beforeEach(() => {
    // Create mock event emitters for stdout and stderr
    mockStdout = {
      on: jest.fn()
    };
    
    mockStderr = {
      on: jest.fn()
    };
    
    // Create mock 'on' event handler for the process
    mockOn = jest.fn();
    
    // Configure the spawn mock
    spawnMock = spawn as jest.Mock;
    spawnMock.mockReturnValue({
      stdout: mockStdout,
      stderr: mockStderr,
      on: mockOn
    });
    
    // Spy on console methods
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should spawn the script process with correct parameters', () => {
    runScript();
    
    expect(spawnMock).toHaveBeenCalledWith('script/script.sh', [], { shell: true });
  });
  
  it('should set up event listeners for stdout, stderr, and close events', () => {
    runScript();
    
    expect(mockStdout.on).toHaveBeenCalledWith('data', expect.any(Function));
    expect(mockStderr.on).toHaveBeenCalledWith('data', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('close', expect.any(Function));
  });
  
  it('should log stdout data when received', () => {
    runScript();
    
    // Get the callback function that was registered for stdout data
    const stdoutCallback = mockStdout.on.mock.calls[0][1];
    
    // Call it with some test data
    stdoutCallback(Buffer.from('Test output'));
    
    expect(console.log).toHaveBeenCalledWith('Output: Test output');
  });
  
  it('should log stderr data when received', () => {
    runScript();
    
    // Get the callback function that was registered for stderr data
    const stderrCallback = mockStderr.on.mock.calls[0][1];
    
    // Call it with some test data
    stderrCallback(Buffer.from('Test error'));
    
    expect(console.error).toHaveBeenCalledWith('Error: Test error');
  });
  
  it('should log exit code when process closes', () => {
    runScript();
    
    // Get the callback function that was registered for the close event
    const closeCallback = mockOn.mock.calls[0][1];
    
    // Call it with a test exit code
    closeCallback(1);
    
    expect(console.log).toHaveBeenCalledWith('Script exited with code 1');
  });
  
  it('should handle a successful script execution correctly', () => {
    runScript();
    
    // Get all the callback functions
    const stdoutCallback = mockStdout.on.mock.calls[0][1];
    const stderrCallback = mockStderr.on.mock.calls[0][1];
    const closeCallback = mockOn.mock.calls[0][1];
    
    // Simulate a successful script execution
    stdoutCallback(Buffer.from('Starting script'));
    stdoutCallback(Buffer.from('Script running'));
    stdoutCallback(Buffer.from('Script completed'));
    closeCallback(0);
    
    expect(console.log).toHaveBeenCalledWith('Output: Starting script');
    expect(console.log).toHaveBeenCalledWith('Output: Script running');
    expect(console.log).toHaveBeenCalledWith('Output: Script completed');
    expect(console.log).toHaveBeenCalledWith('Script exited with code 0');
  });
  
  it('should handle a failing script execution correctly', () => {
    runScript();
    
    // Get all the callback functions
    const stdoutCallback = mockStdout.on.mock.calls[0][1];
    const stderrCallback = mockStderr.on.mock.calls[0][1];
    const closeCallback = mockOn.mock.calls[0][1];
    
    // Simulate a failing script execution
    stdoutCallback(Buffer.from('Starting script'));
    stderrCallback(Buffer.from('Error in script'));
    stderrCallback(Buffer.from('Command not found'));
    closeCallback(1);
    
    expect(console.log).toHaveBeenCalledWith('Output: Starting script');
    expect(console.error).toHaveBeenCalledWith('Error: Error in script');
    expect(console.error).toHaveBeenCalledWith('Error: Command not found');
    expect(console.log).toHaveBeenCalledWith('Script exited with code 1');
  });
});
