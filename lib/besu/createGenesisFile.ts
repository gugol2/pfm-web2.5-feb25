import { writeFileSync } from "fs";
import { resolve } from "path";
import { pickEnvVariable } from "./pickEnvVariable";

interface GenesisConfig {
  chainId: number;
  period: number;
  validators: string[];
  createemptyblocks?: boolean;
}

export function createGenesisFile(config: GenesisConfig) {
  const networkFolderPath = pickEnvVariable("NETWORK_FOLDER_PATH");

  const genesisFilePath = resolve(
    process.cwd(),
    `${networkFolderPath}/genesis.json`
  );

  const genesis = {
    config: {
      chainId: config.chainId,
      berlinBlock: 0,
      clique: {
        blockperiodseconds: config.period,
        epochlength: 30000,
        createemptyblocks: config.createemptyblocks ?? true,
      },
    },
    coinbase: "0x0000000000000000000000000000000000000000",
    difficulty: "0x1",
    extraData: `0x${"0".repeat(64)}${config.validators.join("")}${"0".repeat(
      130
    )}`,
    gasLimit: "0xa00000",
    mixHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    nonce: "0x0",
    timestamp: "0x5c51a607",
    alloc: Object.fromEntries(
      config.validators.map((addr) => [
        addr,
        {
          balance:
            "0x200000000000000000000000000000000000000000000000000000000000000",
        },
      ])
    ),
  };

  writeFileSync(genesisFilePath, JSON.stringify(genesis, null, 2));
}
