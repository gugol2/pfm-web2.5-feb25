import { BesuNetworkConfig } from "../types";

const validateNodeConfiguration = (nodeConfig: BesuNetworkConfig) => {
  // Validate the node count
  if (nodeConfig.nodeCount <= 0 || nodeConfig.nodeCount > 9) {
    throw new Error(
      "Invalid number of nodes. Please enter a positive integer lower than 10."
    );
  }
  // Validate the chain ID
  if (nodeConfig.chainId <= 0) {
    throw new Error("Invalid chain ID. Please enter a positive integer.");
  }
  // Validate the block period
  if (nodeConfig.blockPeriod <= 0) {
    throw new Error("Invalid block period. Please enter a positive integer.");
  }
  // Validate the emptyblocks property
  if (
    nodeConfig.emptyblocks !== undefined &&
    typeof nodeConfig.emptyblocks !== "boolean"
  ) {
    throw new Error(
      "Invalid emptyblocks property. Please enter a boolean value."
    );
  }
  // Validate the node count
  if (nodeConfig.nodeCount <= 0 || nodeConfig.nodeCount > 9) {
    throw new Error(
      "Invalid number of nodes. Please enter a positive integer lower than 10."
    );
  }
};

export { validateNodeConfiguration };
