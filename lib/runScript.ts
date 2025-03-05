import { exec } from "child_process";

export const runScript = () => {
  exec("script/script.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
  });
};
