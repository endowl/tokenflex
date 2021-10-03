var MockNft = artifacts.require("../MockNft.sol");

module.exports = function(deployer) {
  deployer.deploy(MockNft)
};
