import { calculateEnode } from "./calculateEnode";

describe("calculateEnode", () => {
  it("should calculate the correct enode public key from a valid private key", () => {
    const privateKeyHex =
      "0x05d2220cc9810d65bae67e7b867037f52a95b7266730e9dab7e48924874fc9a9";
    const expectedPublicKey =
      "49ba977e2e4bf77c1d40540c80876e8ab82ec0b0c84b4ae576e6a43f6c99df95703ba2eddfa7495bfbf95e61db734540a930b7532706d712f891249f24b066f6";

    const result = calculateEnode(privateKeyHex);
    expect(result).toBe(expectedPublicKey);
  });

  it("should handle private keys without the '0x' prefix", () => {
    const privateKeyHex =
      "05d2220cc9810d65bae67e7b867037f52a95b7266730e9dab7e48924874fc9a9";
    const expectedPublicKey =
      "49ba977e2e4bf77c1d40540c80876e8ab82ec0b0c84b4ae576e6a43f6c99df95703ba2eddfa7495bfbf95e61db734540a930b7532706d712f891249f24b066f6";

    const result = calculateEnode(privateKeyHex);
    expect(result).toBe(expectedPublicKey);
  });

  it("should throw an error for a non hexadecimal private key", () => {
    const invalidPrivateKeyHex = "invalidPrivateKey";

    expect(() => calculateEnode(invalidPrivateKeyHex)).toThrow(
      "Private key must be a hexadecimal string"
    );
  });

  it("should throw an error for an hexadecimal but shorter than 64 characters private key", () => {
    const invalidPrivateKeyHex =
      "0x05d2220cc9810d65bae67e7b867037f52a95b7266730e9dab7e48924874fc9a";

    expect(() => calculateEnode(invalidPrivateKeyHex)).toThrow(
      "Private key must be 32 bytes (64 hex characters)"
    );
  });
});
