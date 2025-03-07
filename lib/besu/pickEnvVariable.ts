import "dotenv/config";

const pickEnvVariable = (envVariable: string): string => {
  const networkFolderPath = process.env[envVariable];

  if (!networkFolderPath) {
    throw new Error(`${envVariable} is not defined in the .env file`);
  }

  return networkFolderPath;
};

export { pickEnvVariable };
