import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { BesuAddress } from "../types";

export const generateKeyPair = (): BesuAddress => {
  const privateKey = randomBytes(32).toString("hex");
  const privateKeyBytes = "0x" + privateKey;
  const wallet = new Wallet(privateKeyBytes);

  // Get the public key from the wallet's signingKey
  const publicKey = wallet.signingKey.publicKey;

  const aver = {
    privateKey,
    publicKey,
    address: wallet.address.toLowerCase(),
  };

  console.log({ aver });

  return aver;
};
