import { readFile } from "fs/promises";
import { join } from "path";
import { pickEnvVariable } from "../pickEnvVariable.js";

const readNodeAddressFromHost = async (
  containerName: string
): Promise<string> => {
  const networkFolderPath = pickEnvVariable("NETWORK_FOLDER_PATH");

  const filePath = join(
    networkFolderPath,
    `${containerName}/data`,
    "node1Address"
  );

  console.log(`Reading node address from ${filePath}`);
  const data = await readFile(filePath, "utf8");
  return data.trim();
};

export { readNodeAddressFromHost };
