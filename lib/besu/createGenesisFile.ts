import { writeFileSync } from "fs";
import { resolve } from "path";

interface GenesisConfig {
  chainId: number;
  period: number;
  validators: string[];
}

const networkRelativePath = `lib/besu/network`;

export function createGenesisFile(config: GenesisConfig) {
  const genesisFilePath = resolve(
    process.cwd(),
    `${networkRelativePath}/genesis.json`
  );

  const genesis = {
    config: {
      chainId: config.chainId,
      clique: {
        blockperiodseconds: config.period,
        epochlength: 30000,
      },
    },
    alloc: Object.fromEntries(
      config.validators.map((addr) => [
        addr,
        {
          balance:
            "0x200000000000000000000000000000000000000000000000000000000000000",
        },
      ])
    ),
    coinbase: "0x0000000000000000000000000000000000000000",
    extraData: `0x${"0".repeat(64)}${config.validators.join("")}${"0".repeat(
      130
    )}`,
    nonce: "0x0",
    timestamp: "0x5f95b113",
    gasLimit: "0x47b760",
  };

  writeFileSync(genesisFilePath, JSON.stringify(genesis, null, 2));
}
