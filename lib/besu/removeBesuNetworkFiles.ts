import { exec } from "child_process";

/**
 * Removes Besu network files using sudo privileges
 * @returns {Promise<string>} A promise that resolves with the command output or rejects with an error
 */
const removeBesuNetworkFiles = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec("sudo rm -rfv lib/besu/network/besu*", (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Error: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
};

export { removeBesuNetworkFiles };
