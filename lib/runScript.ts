import { spawn } from 'child_process';

export const runScript = () => {
  const scriptProcess = spawn('script/script.sh', [], { shell: true });
  
  scriptProcess.stdout.on('data', (data) => {
    console.log(`Output: ${data}`);
  });
  
  scriptProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });
  
  scriptProcess.on('close', (code) => {
    console.log(`Script exited with code ${code}`);
  });
};
