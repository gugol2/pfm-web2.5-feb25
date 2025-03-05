import Docker from "dockerode";
import { initDocker } from "./initDocker";

// Mock the Docker constructor to avoid actual Docker connections during testing
jest.mock("dockerode");

describe("Docker Singleton", () => {
  // Clear the mock before each test to ensure a clean slate
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a Docker instance on first call", () => {
    const dockerClient = initDocker();

    expect(dockerClient).toBeDefined();
    expect(Docker).toHaveBeenCalledTimes(1);
  });

  it("should return the same instance on subsequent calls", () => {
    const firstClient = initDocker();
    const secondClient = initDocker();

    expect(firstClient).toEqual(secondClient);
  });

  it("should return an instance of Docker", () => {
    const dockerClient = initDocker();

    expect(dockerClient).toBeInstanceOf(Docker);
  });
});
