const HDWalletProvider = require("@truffle/hdwallet-provider");
const seed_phrase = 'witness cliff adjust waste inject convince frequent patch enough spirit hurdle humble'
const infura_ropsten_link = "wss://ropsten.infura.io/ws/v3/e71b380ddc7c4d4f8fc29c23caaafb17"

module.exports = {
  contracts_build_directory:'.decentralized_voting/src/contracts',
  
  networks: {
    
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
   },

    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      network_id: '*',
      networkCheckTimeout: 1000000,
      gas: 750000,
          gasprice: 45000000,
          confirmations: 2,
          timoutBlocks: 200,
          skipDryRun: false,
          websocket: true,
          timeoutBlocks: 50000,
      provider: () =>
        new HDWalletProvider({
          mnemonic: 'witness cliff adjust waste inject convince frequent patch enough spirit hurdle humble',
          providerOrUrl: "wss://ropsten.infura.io/ws/v3/e71b380ddc7c4d4f8fc29c23caaafb17",
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/60'/0'/0/",
        })
    },
  },

  compilers: {
    solc: {
      version: "0.8.12",
    },
  },
  
};
