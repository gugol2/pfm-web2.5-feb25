import readline from "readline";
import { runScript } from "./runScript.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Do you want to run the script? (y/n)", (response) => {
  if (response.toLowerCase() === "y") {
    console.log("running script");
    runScript();
  } else if (response.toLowerCase() === "n") {
    console.log("ok, not running the script");
  } else {
    console.log("Option not available!");
  }

  rl.close();
});
