import "dotenv/config";

const pickEnvVariable = (network: string): string => {
  const networkFolderPath = process.env[network];

  if (!networkFolderPath) {
    throw new Error(`${network} is not defined in the .env file`);
  }

  return networkFolderPath;
};

export { pickEnvVariable };
