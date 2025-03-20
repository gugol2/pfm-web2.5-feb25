import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { BesuAddress } from "../types";

export const generateKeyPair = (): BesuAddress => {
  const privateKey = randomBytes(32).toString("hex");
  const privateKeyBytes = "0x" + privateKey;
  const wallet = new Wallet(privateKeyBytes);

  const address = wallet.address.toLowerCase();

  return { privateKey, address };
};
