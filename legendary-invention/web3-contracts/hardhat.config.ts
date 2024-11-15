import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
      networks: {
        nibiruTestnet1: {
          url: "https://evm-rpc.testnet-1.nibiru.fi/",
          chainId: 0x1C2A, // 7210 in decimal
          accounts: ["0xYOUR_PRIVATE_KEY"], // Add your private key here
        },
        nibiruDevnet1: {
          url: "https://evm-rpc.devnet-1.nibiru.fi/",
          chainId: 0x1C34, // 7220 in decimal
          accounts: ["0xYOUR_PRIVATE_KEY"],
        },
        nibiruDevnet3: {
          url: "https://evm-rpc.devnet-3.nibiru.fi/",
          chainId: 0x1C36, // 7222 in decimal
          accounts: ["0xYOUR_PRIVATE_KEY"],
        },
        nibiruLocalnet: {
          url: "http://127.0.0.1:8545",
          chainId: 0x1C36, // 7222 in decimal
          accounts: ["0xYOUR_PRIVATE_KEY"],
        },
    },
};

export default config;