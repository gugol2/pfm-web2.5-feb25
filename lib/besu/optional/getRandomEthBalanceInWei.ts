/**
 * Generates a random Ethereum balance in wei as a hexadecimal string.
 * Besu represents wei values as hex strings with '0x' prefix.
 *
 * @returns {string} Random Ethereum balance in wei as a hexadecimal string
 */
const getRandomEthBalanceInWei = (): string => {
  // Ethereum has a maximum of 2^256 wei, but we'll use a reasonable range
  // This creates a random bigint between 0 and 10^36 wei (which is still enormous)
  // 10^36 wei is approximately 10^18 ETH (or 1 quintillion ETH)

  // Generate a random number between 0 and 10^36
  const maxWei = 10n ** 36n;
  const randomBigInt = BigInt(
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  );
  const scaledRandom =
    (randomBigInt * maxWei) / BigInt(Number.MAX_SAFE_INTEGER);

  // Convert to hexadecimal string with '0x' prefix
  const hexValue = "0x" + scaledRandom.toString(16);

  return hexValue;
};

export { getRandomEthBalanceInWei };
