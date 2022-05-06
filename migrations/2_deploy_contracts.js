const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const CarlCoin = artifacts.require("CarlCoin");
const VoteHandler = artifacts.require("Votehandler");

module.exports = async function(deployer) {
  const token_contract = await deployProxy(CarlCoin, { deployer });
  await deployProxy(VoteHandler, [token_contract.address], { deployer });
};