//var HDWalletProvider = require("truffle-hdwallet-provider");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MNEMONIC = 'club glad victory relief shallow present notable devote garbage moral stem vessel';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function (){
        return new HDWalletProvider(
          MNEMONIC, 'https://ropsten.infura.io/v3/56f832e5e422412186a251ba958cff63'
        )
      },
      network_id: 3,
      gas: 4000000 
    }
  },
  compilers: {
    solc: {
       version: "0.5",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};
