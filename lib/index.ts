import readline from "readline";
import { runScript } from "./runScript.js";
import { createGenesisFile } from "./besu/createGenesisFile.js";
import { createNetwork } from "./besu/network-manager.js";
import { initDocker } from "./docker/initDocker.js";
import { getAddressForFirstNode } from "./besu/optional/getAddressForFirstNode.js";
import { readNodeAddressFromHost } from "./besu/optional/readNodeAddressFromHost.js";
import { getRandomEthBalanceInWei } from "./besu/optional/getRandomEthBalanceInWei.js";
import { setupDockerNetwork } from "./docker/setupDockerNetwork.js";
import { calculatePublicKeyForEnode } from "./besu/calculatePublicKeyForEnode.js";
import { readBesuPrivateKey } from "./besu/readBesuPrivateKey.js";
import { N } from "ethers";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const handleInput = (input: string) => {
  const command = input.trim().toLowerCase();

  switch (command) {
    case "exec-besu":
      console.log("running script");
      runScript();
      rl.close();
      break;
    case "exit":
      console.log("Goodbye!");
      rl.close();
      break;
    case "help":
      showHelp();
      promptInput();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      showHelp();
      promptInput();
  }
};

const promptInput = () => {
  rl.question("> ", handleInput);
};

const showHelp = () => {
  console.log("\nAvailable commands:");
  console.log(" - help: Show available commands");
  console.log(" - exec-besu: exec the besu script");
  console.log(" - exit: Quit the program\n");
};

const initCommandLine = () => {
  console.log("Hello from this command line, what would you like to do? ");

  showHelp();
  promptInput();
};

// Start the cl interaction
initCommandLine();

// createNetwork();

// createGenesisFile({
//   chainId: 1337,
//   period: 15,
//   validators: ["0x" + "1".repeat(40), "0x" + "2".repeat(40)],
// });

// const config = {
//   name: "besu-node-0",
//   port: 30303,
//   rpcPort: 8545,
//   validatorAddress: "0x15d32fdcdc127359913b7efa788a9e1c40d158fa",
//   key: "8f2114d2c4a4d31f957a48171b57bb90c808b5ea712c57bbd1a0629cdde51e29",
// };

// const docker = initDocker();
// const container = getAddressForFirstNode(docker, config.name);
// console.log({ container });

// const node1Address = await readNodeAddressFromHost(config.name);
// console.log({ node1Address });

// Example usage
// const randomBalance = getRandomEthBalanceInWei();
// console.log(`Random ETH balance: ${randomBalance}`);

createNetwork();

// const maybeEnode = calculatePublicKeyForEnode(
//   "0xe803581d06056603400196edb062dc0683701f6127a16703fad0fa18085fa4fc"
// );
// console.log({ maybeEnode });

// Usage
// const privateKey = await readBesuPrivateKey("besu-node-0");

// console.log({ privateKey });
