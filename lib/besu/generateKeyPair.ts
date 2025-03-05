import { randomBytes } from "crypto";
import { Wallet } from "ethers";

export function generateKeyPair() {
  const privateKey = randomBytes(32).toString("hex");
  const wallet = new Wallet(privateKey);
  return {
    privateKey,
    address: wallet.address.toLowerCase(),
  };
}
