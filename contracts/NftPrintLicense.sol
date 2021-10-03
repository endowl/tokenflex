// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";


struct License {
  uint256 artistRoyalty;
  uint256 ownerRoyalty;
  uint256 promoterCommission;
  bool exists;
}


contract NftPrintLicense is Ownable {
  event LicensesEnabledForCollection(address collectionAddress, uint256 artistRoyalty, uint256 ownerRoyalty,
    uint256 promoterCommission);
  event LicensesDisabledForCollection(address collectionAddress);
  event PrintLicensed(address collectionAddress, uint256 tokenId, address promoter,
    uint256 artistShare, uint256 ownerShare, uint256 promoterShare, address licensee);
  event Withdrawn(address indexed payee, uint256 weiAmount);

  mapping(address => License) public collectionLicenses;
  mapping(address => mapping(uint256 => mapping(address => bool))) public licenseBuyers;
  mapping(address => uint256) private pendingWithdrawal;

  function enableLicensesForCollection(
    address collectionAddress,
    uint256 artistRoyalty, uint256 ownerRoyalty, uint256 promoterCommission
  ) public {
    // Only the owner of a collection is allowed to enable license for a collection
    address owner = getCollectionOwner(collectionAddress);
    require(owner == msg.sender, "not authorized");

    // Fail when a license already exists
    require(!collectionLicenses[collectionAddress].exists, "License already enabled");

    // Created the license object and save it
    License memory license = License(artistRoyalty, ownerRoyalty, promoterCommission, true);
    collectionLicenses[collectionAddress] = license;
    emit LicensesEnabledForCollection(collectionAddress, artistRoyalty, ownerRoyalty, promoterCommission);
  }

  function disableLicensesForCollection(address collectionAddress) public {
    // only the collection owner can disable licensing
    address owner = getCollectionOwner(collectionAddress);
    require(owner == msg.sender, "not authorized");

    // fail when license isn't enabled
    require(collectionLicenses[collectionAddress].exists, "licensing not enabled");

    delete collectionLicenses[collectionAddress];

    emit LicensesDisabledForCollection(collectionAddress);
  }

  function getLicenseToPrint(address collectionAddress, uint256 tokenId, address promoter) public payable {
    License storage license = collectionLicenses[collectionAddress];

    // Fail when a license hasn't been defined for the collection
    require(license.exists, "no license defined");

    // Fail when the payment is too small
    uint256 requiredPayment = getRequiredPayment(collectionAddress);
    require(msg.value >= requiredPayment, "payment too low");

    // calculate royalty and commission shares
    uint256 artistShare = license.artistRoyalty;
    uint256 ownerShare = license.ownerRoyalty;
    uint256 promoterShare = 0;
    if (licenseBuyers[collectionAddress][tokenId][promoter]) {
      // When the promoter previously bought a license, give them the commission
      promoterShare += license.promoterCommission;
    } else {
      // Otherwise, split it proportioanlly between the tokenOwner and the artist
      uint256 totalRoyalty = license.artistRoyalty + license.ownerRoyalty;
      artistShare += license.promoterCommission * (license.artistRoyalty / totalRoyalty);
      ownerShare += license.promoterCommission - artistShare;
    }

    address artist = getCollectionOwner(collectionAddress);
    address tokenOwner =  IERC721(collectionAddress).ownerOf(tokenId);

    pendingWithdrawal[artist] += artistShare;
    pendingWithdrawal[tokenOwner] += ownerShare;
    pendingWithdrawal[promoter] += promoterShare;

    // allocate the rest to the contract to cover production costs
    pendingWithdrawal[this.owner()] += msg.value - artistShare - ownerShare - promoterShare;

    // Record the purchase
    licenseBuyers[collectionAddress][tokenId][msg.sender] = true;

    emit PrintLicensed(collectionAddress, tokenId, promoter, artistShare, ownerShare, promoterShare, msg.sender);
  }
  
  function getCollectionOwner(address collectionAddress) public view returns(address){
    return Ownable(collectionAddress).owner();
  }

  function getBalance() public view returns(uint256) {
    return pendingWithdrawal[msg.sender];
  }

  function withdraw() public {
    uint256 amount = pendingWithdrawal[msg.sender];
    pendingWithdrawal[msg.sender] = 0;
    payable(msg.sender).transfer(amount);

    emit Withdrawn(msg.sender, amount);
  }

  function getRequiredPayment(address collectionAddress) public view returns(uint256){
    License storage license = collectionLicenses[collectionAddress];
    require(license.exists, "no license defined");
    return license.artistRoyalty + license.ownerRoyalty + license.promoterCommission; // TODO Add the cost
  }
}
