/**
 * Test helper utilities
 */

/**
 * Helper function to wait for a specified amount of time
 * @param ms Time to wait in milliseconds
 * @returns Promise that resolves after the specified time
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Creates a mock object with type safety
 * @param overrides Partial object to override default mock values
 * @returns Mocked object with type T
 */
export function createMock<T extends object>(overrides: Partial<T> = {}): T {
  return overrides as T;
}

/**
 * Creates a spy for console.error that mocks its implementation
 * @returns Jest spy instance for console.error
 */
export const createConsoleErrorSpy = (mockedImplementation?: jest.Mock): jest.SpyInstance => {
  return jest.spyOn(console, 'error').mockImplementation(mockedImplementation);
};

/**
 * Wraps async tests to handle errors consistently
 * @param fn Test function to wrap
 */
export const wrapTest = (fn: () => Promise<void>) => async () => {
  try {
    await fn();
  } catch (error) {
    console.error('Test error:', error);
    throw error;
  }
}; 