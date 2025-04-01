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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const handleInput = (input: string) => {
  const command = input.trim().toLowerCase();

  switch (command) {
    case "besu":
      console.log("How many nodes do you want to create?");
      rl.question("Number of nodes: ", async (numberOfNodes) => {
        const nodeCount = parseInt(numberOfNodes);
        if (isNaN(nodeCount)) {
          console.log(
            "Invalid number of nodes. Please enter a positive integer lower than 10."
          );
          rl.close();
          return;
        }
        rl.question(
          "Create empty blocks, 0 => false, 1 => true, default: false: ",
          async (emptyblocks) => {
            const emptyblocksBool = emptyblocks === "1" ? true : false;
            console.log(
              `Creating a network with ${nodeCount} nodes and emptyblocks set to ${emptyblocksBool}`
            );
            await createNetwork(nodeCount, emptyblocksBool);
            rl.close();
          }
        );
      });
      break;
    case "script":
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
  console.log(" - script: Run the script");
  console.log(" - besu: start a besu network");
  console.log(" - exit: Quit the program\n");
};

const initCommandLine = () => {
  console.log("Hello from this command line, what would you like to do? ");

  showHelp();
  promptInput();
};

// Start the cl interaction
initCommandLine();
