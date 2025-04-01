import { ethers } from 'ethers';

/**
 * Derives an Ethereum address from a private key
 * @param privateKey - The private key (with or without 0x prefix)
 * @returns The Ethereum address
 */
function getAddressFromPrivateKey(privateKey: string): string {
  // Ensure private key has 0x prefix
  const formattedPrivateKey = privateKey.startsWith('0x') 
    ? privateKey 
    : `0x${privateKey}`;
  
  try {
    // Create a wallet instance from the private key
    const wallet = new ethers.Wallet(formattedPrivateKey);
    
    // Get the address
    const address = wallet.address;
    
    return address;
  } catch (error) {
    console.error('Error deriving address from private key:', error);
    throw error;
  }
}

export {getAddressFromPrivateKey}