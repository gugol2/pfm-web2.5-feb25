import pkg from "elliptic";
const { ec: EC } = pkg;

// Function to convert a private key to an enode public key
const calculateEnode = (privateKeyHex: string): string => {
  // Remove '0x' prefix if present
  if (privateKeyHex.startsWith("0x")) {
    privateKeyHex = privateKeyHex.slice(2);
  }

  // Check if the private key is a valid hex string
  if (!/^[0-9a-fA-F]+$/.test(privateKeyHex)) {
    throw new Error("Private key must be a hexadecimal string");
  }

  // Check if the private key has the correct length (32 bytes = 64 hex chars)
  if (privateKeyHex.length !== 64) {
    throw new Error("Private key must be 32 bytes (64 hex characters)");
  }

  // Initialize the elliptic curve
  const ec = new EC("secp256k1");

  // Generate key pair from private key
  const keyPair = ec.keyFromPrivate(privateKeyHex, "hex");

  // Get the public key in uncompressed format (with 04 prefix)
  const publicKeyFull = keyPair.getPublic("hex");

  // Remove the '04' prefix which indicates uncompressed format
  // The '04' prefix is a single byte that indicates this is an uncompressed key
  const publicKeyWithoutPrefix = publicKeyFull.slice(2);

  // For blockchain node IDs like enodes, we use the full uncompressed public key
  // without the prefix byte
  return publicKeyWithoutPrefix;
};

export { calculateEnode };
