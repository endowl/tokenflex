const NftPrintLicense = artifacts.require("./NftPrintLicense.sol");
const MockNft = artifacts.require("../test/MockNft.sol")

contract("NftPrintLicense", accounts => {
  let instance, enableResult, mockNftInstance;

  before(async () => {
    instance = await NftPrintLicense.deployed();
    mockNftInstance = await MockNft.deployed()
    enableResult = await instance.enableLicensesForCollection(mockNftInstance.address, 10, 20, 30, { from: accounts[0] });
  })

  it("should enable licensing for an NFT collection", async () => {
    let licensedEnabledLog = enableResult.logs[0]
    assert.equal(licensedEnabledLog.event, 'LicensesEnabledForCollection')
    assert.equal(licensedEnabledLog.args.collectionAddress, mockNftInstance.address)
    assert.equal(licensedEnabledLog.args.artistRoyalty, 10)
    assert.equal(licensedEnabledLog.args.ownerRoyalty, 20)
    assert.equal(licensedEnabledLog.args.promoterCommission, 30)
  });

  it("should not allow non-owner to enable", async () => {
    try {
      await instance.enableLicensesForCollection(mockNftInstance.address, 10, 20, 30, { from: accounts[1] });
      throw "This should not execute"
    } catch(e) {
      assert.equal(e.reason, 'not authorized')
    }
  })

  it("should provide the correct required payment", async () => {
    const requiredPayment = await instance.getRequiredPayment(mockNftInstance.address)
    assert.equal(requiredPayment, 60)
  })

  it("should issue a license with payment", async () => {
    const nftResult = await mockNftInstance.mint(1, {from: accounts[1]})
    const requiredPayment = await instance.getRequiredPayment(mockNftInstance.address)

    const licenseResult = await instance.getLicenseToPrint(mockNftInstance.address, 1, accounts[3], {
      from: accounts[2],
      value: requiredPayment
    })

    const log = licenseResult.logs[0]
    assert.equal(log.event, 'PrintLicensed')
    assert.equal(log.args.promoter, accounts[3])
    assert.equal(log.args.licensee, accounts[2])
    assert.equal(log.args.artistShare.toNumber(), 20)
    assert.equal(log.args.ownerShare.toNumber(), 40)
    assert.equal(log.args.promoterShare.toNumber(), 0)
  });

});
