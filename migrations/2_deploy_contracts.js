var NftPrintLicense = artifacts.require("./NftPrintLicense.sol");

module.exports = function(deployer) {
  deployer.deploy(NftPrintLicense);
};
