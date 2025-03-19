import * as path from "path";
import fs from "fs/promises";
import { pickEnvVariable } from "./pickEnvVariable.js";

// Function to read the private key from the Besu data folder
const readBesuPrivateKey = async (
  dataPath: string,
  encoding: BufferEncoding = "utf-8",
  maxRetries: number = 10,
  retryDelayMs: number = 1000
): Promise<string> => {
  const networkFolderPath = pickEnvVariable("NETWORK_FOLDER_PATH");

  // The private key is typically stored in the 'key' file in the data directory
  const keyFilePath = path.join(
    process.cwd(),
    networkFolderPath,
    dataPath,
    "data",
    "key"
  );

  let retries = 0;

  while (retries < maxRetries) {
    try {
      const data = await fs.readFile(keyFilePath, encoding);
      return data;
    } catch (err) {
      console.warn(`Failed to read file. Retrying in ${retryDelayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      retries++;
    }
  }

  throw new Error(`Failed to read file after ${maxRetries} attempts`);
};

export { readBesuPrivateKey };
