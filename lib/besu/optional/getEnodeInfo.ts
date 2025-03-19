import axios from "axios";

interface AdminNodeInfoResponse {
  data: {
    result: { enode: string };
  };
}

const getEnodeInfo = async (
  rpcUrl: string = "http://localhost:8545",
  maxRetries: number = 30,
  delayMs: number = 2000
): Promise<string> => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(
        `Attempt ${retries + 1}/${maxRetries} to connect to Besu node...`
      );

      // Try to get the node info
      const response: AdminNodeInfoResponse = await axios.post(
        rpcUrl,
        {
          jsonrpc: "2.0",
          method: "admin_nodeInfo",
          params: [],
          id: 1,
        },
        {
          timeout: 3000, // Set a timeout for the request
        }
      );

      if (response.data && response.data.result && response.data.result.enode) {
        const enodeUrl = response.data.result.enode;
        console.log("Successfully retrieved enode URL:", enodeUrl);
        return enodeUrl;
      } else {
        console.log("Received response but no valid enode found, retrying...");
      }
    } catch (error: any) {
      console.log(`Node not ready yet: ${error.message || "Unknown error"}`);
    }

    // Wait before the next attempt
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    retries++;
  }

  try {
    // Define the JSON-RPC request body
    const requestBody = JSON.stringify({
      jsonrpc: "2.0",
      method: "admin_nodeInfo",
      params: [],
      id: 1,
    });

    // Make the request to your Besu node
    const response = await fetch("http://localhost:8545", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    // Parse the response
    const data = await response.json();

    if (data.error) {
      throw new Error(`JSON-RPC error: ${data.error.message}`);
    }

    // Extract the enode URL from the result
    const enodeUrl = data.result.enode;
    console.log("Enode URL:", enodeUrl);

    return enodeUrl;
  } catch (error) {
    console.error("Error getting enode information:", error);
    throw error;
  }
};

const waitForNodeAndGetEnode = async (
  rpcUrl: string = "http://localhost:8545",
  maxRetries: number = 30,
  delayMs: number = 2000
): Promise<string> => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(
        `Attempt ${retries + 1}/${maxRetries} to connect to Besu node...`
      );

      // Try to get the node info
      const response: AdminNodeInfoResponse = await axios.post(
        rpcUrl,
        {
          jsonrpc: "2.0",
          method: "admin_nodeInfo",
          params: [],
          id: 1,
        },
        {
          timeout: 3000, // Set a timeout for the request
        }
      );

      if (response.data && response.data.result && response.data.result.enode) {
        const enodeUrl = response.data.result.enode;
        console.log("Successfully retrieved enode URL:", enodeUrl);
        return enodeUrl;
      } else {
        console.log("Received response but no valid enode found, retrying...");
      }
    } catch (error: any) {
      console.log(`Node not ready yet: ${error.message || "Unknown error"}`);
    }

    // Wait before the next attempt
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    retries++;
  }

  throw new Error(`Failed to get enode URL after ${maxRetries} attempts`);
};

export { getEnodeInfo, waitForNodeAndGetEnode };
