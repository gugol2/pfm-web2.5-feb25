import { Wallet } from "ethers";
import { generateKeyPair } from "./generateKeyPair";

describe("generateKeyPair", () => {
  const addressHexRegex = /^0x[0-9a-f]{40}$/;
  const privateKeyHexRegex = /^[0-9a-f]{64}$/;

  it("should generate a valid key pair", () => {
    const keyPair = generateKeyPair();

    // Check that privateKey exists and is a 64-character hex string
    expect(keyPair.privateKey).toBeDefined();
    expect(keyPair.privateKey).toMatch(privateKeyHexRegex);

    // Check that address exists and is a valid Ethereum address
    expect(keyPair.address).toBeDefined();
    expect(keyPair.address.startsWith("0x")).toBe(true);
    expect(keyPair.address).toMatch(addressHexRegex);
  });

  it("should generate unique key pairs", () => {
    const keyPair1 = generateKeyPair();
    const keyPair2 = generateKeyPair();

    // Ensure different private keys are generated
    expect(keyPair1.privateKey).not.toEqual(keyPair2.privateKey);
    expect(keyPair1.address).not.toEqual(keyPair2.address);
  });

  it("should create a valid Ethereum wallet from the private key", () => {
    const keyPair = generateKeyPair();

    // Recreate wallet from private key and verify address matches
    const wallet = new Wallet(keyPair.privateKey);
    expect(wallet.address.toLowerCase()).toBe(keyPair.address);
  });

  it("should generate lowercase address", () => {
    const keyPair = generateKeyPair();

    // Verify address is lowercase
    expect(keyPair.address).toBe(keyPair.address.toLowerCase());
  });

  it("should have correct private key length", () => {
    const keyPair = generateKeyPair();

    // Verify private key is exactly 32 bytes (64 hex characters)
    const privateKeyBuffer = Buffer.from(keyPair.privateKey, "hex");
    expect(privateKeyBuffer.length).toBe(32);
  });
});
