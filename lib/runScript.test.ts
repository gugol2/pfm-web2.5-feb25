import { exec } from "child_process";
import { runScript } from "./runScript";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("runScript", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log stdout when script executes successfully", () => {
    const mockExec = exec as unknown as jest.Mock;

    mockExec.mockImplementation((_command, callback) => {
      callback(null, "Success output", "");
    });

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    runScript();

    expect(consoleLogSpy).toHaveBeenCalledWith("Script output: Success output");

    consoleLogSpy.mockRestore();
  });

  it("should log an error message if exec returns an error", () => {
    const mockExec = exec as unknown as jest.Mock;

    mockExec.mockImplementation((_command, callback) => {
      callback(new Error("Execution failed"), "", "");
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    runScript();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error executing script: Execution failed"
    );

    consoleErrorSpy.mockRestore();
  });

  it("should log stderr if script produces an error output", () => {
    const mockExec = exec as unknown as jest.Mock;

    mockExec.mockImplementation((_command, callback) => {
      callback(null, "", "Some error output");
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    runScript();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Script stderr: Some error output"
    );

    consoleErrorSpy.mockRestore();
  });
});
