require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    // Local development
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },

    // Sepolia testnet
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        process.env.SEPOLIA_RPC_URL
      ),
      network_id: 11155111,       // Sepolia's network id
      gas: 2500000,               // Gas limit
      gasPrice: 3000000000,      // 10 gwei
      confirmations: 2,           // Wait 2 blocks for confirmation
      timeoutBlocks: 200,         // Wait 200 blocks before timeout
      skipDryRun: true            // Skip dry run before migrations
    }
  },

  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};