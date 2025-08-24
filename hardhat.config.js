require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const TEST_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

module.exports = {
  solidity: "0.7.3",
  networks: {
    localhost: {
      url: "http://localhost:8545",  // 修改这一行
      chainId: 31337
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.PRIVATE_KEY || TEST_PRIVATE_KEY]
    }
  }
};