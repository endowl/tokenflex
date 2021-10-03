const NftPrintLicense = artifacts.require("./NftPrintLicense.sol");
const MockNft = artifacts.require("../test/MockNft.sol")

contract("NftPrintLicense", accounts => {
  let instance, enableResult, mockNftInstance;
  let artistAccount = accounts[0]
  let ownerAccount = accounts[1]
  let licenseBuyer1Account = accounts[2]
  let licenseBuyer2Account = accounts[3]
  let unauthorizedPromoterAccount = accounts[4]

  before(async () => {
    instance = await NftPrintLicense.deployed();
    mockNftInstance = await MockNft.deployed()
    enableResult = await instance.enableLicensesForCollection(mockNftInstance.address, 10, 20, 30, { from: artistAccount });
    await mockNftInstance.mint(1, {from: ownerAccount})
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
      await instance.enableLicensesForCollection(mockNftInstance.address, 10, 20, 30, { from: ownerAccount });
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
    const requiredPayment = await instance.getRequiredPayment(mockNftInstance.address)

    const licenseResult = await instance.getLicenseToPrint(mockNftInstance.address, 1, unauthorizedPromoterAccount, {
      from: licenseBuyer1Account,
      value: requiredPayment
    })

    const log = licenseResult.logs[0]
    assert.equal(log.event, 'PrintLicensed')
    assert.equal(log.args.promoter, unauthorizedPromoterAccount)
    assert.equal(log.args.licensee, licenseBuyer1Account)
    assert.equal(log.args.artistShare.toNumber(), 20)
    assert.equal(log.args.ownerShare.toNumber(), 40)
    assert.equal(log.args.promoterShare.toNumber(), 0)
  });

  it("should pay a known promoter", async () => {
    const requiredPayment = await instance.getRequiredPayment(mockNftInstance.address)

    const licenseResult = await instance.getLicenseToPrint(mockNftInstance.address, 1, licenseBuyer1Account, {
      from: licenseBuyer2Account,
      value: requiredPayment
    })

    const log = licenseResult.logs[0]
    assert.equal(log.event, 'PrintLicensed')
    assert.equal(log.args.promoter, licenseBuyer1Account)
    assert.equal(log.args.licensee, licenseBuyer2Account)
    assert.equal(log.args.artistShare.toNumber(), 10)
    assert.equal(log.args.ownerShare.toNumber(), 20)
    assert.equal(log.args.promoterShare.toNumber(), 30)
  });

  it("should allow withdrawals", async () => {
    const requiredPayment = await instance.getRequiredPayment(mockNftInstance.address)

    await instance.getLicenseToPrint(mockNftInstance.address, 1, licenseBuyer1Account, {
      from: licenseBuyer2Account,
      value: requiredPayment
    })

    const withdrawalResult = await instance.withdraw({from: artistAccount})

    const log = withdrawalResult.logs[0]
    assert.equal(log.event, 'Withdrawn')
    assert.equal(log.args.payee, artistAccount)
  });
});
