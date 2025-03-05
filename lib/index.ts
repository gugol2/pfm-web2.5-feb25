import readline from "readline";
import { runScript } from "./runScript.js";

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
