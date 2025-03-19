import { exec } from "child_process";
import * as path from "path";
import { promisify } from "util";

// Convert exec to use promises
const execPromise = promisify(exec);

/**
 * Creates a folder with the given name using command line commands
 * @param folderName - The name of the folder to create
 * @param basePath - Optional base path where the folder should be created (defaults to current directory)
 * @returns Promise that resolves to the full path of the created folder
 */
const createBesuNodeFolderStructure = async (
  folderName: string,
  basePath: string = "."
): Promise<string> => {
  try {
    // Create the full path
    const fullPath = path.join(basePath, folderName);

    // Command differs between Windows and Unix-based systems
    const isWindows = process.platform === "win32";
    const command = isWindows
      ? `if not exist "${fullPath}" mkdir "${fullPath}"`
      : `mkdir -p "${fullPath}"`;

    // Execute the command
    await execPromise(command);
    console.log(`Folder "${folderName}" created successfully at ${fullPath}`);

    return fullPath;
  } catch (error) {
    console.error(`Error creating folder "${folderName}":`, error);
    throw error;
  }
};

export { createBesuNodeFolderStructure };
