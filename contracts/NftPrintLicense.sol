// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./NftPrintLicense.sol";

struct License {
  uint256 printLimit;
  uint256 printsUsed;
  uint256 artistRoyalty;
  uint256 ownerRoyalty;
  uint256 promoterCommission;
}


contract NftPrintLicense {
  event LicensesEnabledForCollection(address collectionAddress, uint256 artistRoyalty, uint256 ownerRoyalty,
    uint256 promoterCommission);
  event PrintLicensed(address collectionAddress, uint256 tokenId, address promoter, address licensee);

  mapping(address => License) collectionLicenses;
  mapping(address => uint256) pendingWithdrawal;

  function enableLicensesForCollection(
    address collectionAddress,
    uint256 artistRoyalty, uint256 ownerRoyalty, uint256 promoterCommission
  ) public {
    // Only the owner of a collection is allowed to enable license for a collection
    address owner = getCollectionOwner(collectionAddress);
    assert(owner == msg.sender, "not authorized");

    // Fail when a license already exists
    assert(collectionLicenses[collectionAddress] != null, "License already enabled");

    // Created the license object and save it
    License license = License(printLimit, artistRoyalty, ownerRoyalty, promoterCommission);
    collectionLicenses[collectionAddress] = license;
    emit LicensesEnabledForCollection(collectionAddress, artistRoyalty, ownerRoyalty, promoterCommission, grantee);
  }

//  function enableLicensesForToken(
//    address collectionAddress,
//    uint256 tokenId
//  ) {
//    License license = collectionLicenses[collectionAddress];
//    assert(license != null, "Collection must be licensed first");
//
//    address tokenOwner =  IERC721(collectionAddress).ownerOf(tokenId);
//    assert(tokenOwner == message.sender, "Not authorized");
//
//
//  }

  function licensePrint(address collectionAddress, uint256 tokenId, address promoter) payable {
    License license = collectionLicenses[collectionAddress];

    // Fail when a license hasn't been defined for the collection
    assert(license != null, "no license defined");

    // Increment the number of timed the collection has been printed
    printsLicensed[address] += 1;

    // Fail when the payment is too small
    uint256 requiredPayment = getRequiredPayment(collectionAddress, tokenId);
    assert(msg.value >= requiredPayment, "payment too low");

    // allocate artistRoyalty to the current collection owner
    pendingWithdrawal[getCollectionOwner(collectionAddress)] += license.artistRoyalty;

    // allocate ownerRoyalty to the current tokenOwner
    address tokenOwner =  IERC721(collectionAddress).ownerOf(tokenId);
    pendingWithdrawal[tokenOwner] += license.ownerRoyalty;

    // allocate promoterCommission to the promoter who sold the prints
    pendingWithdrawal[promoter] += license.promoterCommission;

    // allocate the rest to the contract to cover production costs
    pendingWithdrawal[this.owner] += msg.value - license.artistRoyalty - license.ownerRoyalty - license.promoterCommission;

    emit PrintLicensed(collectionAddress, tokenId, promoter, msg.sender);
  }

  function withdraw() public {
    uint256 amount = pendingWithdrawal[msg.sender];
    pendingWithdrawal[msg.sender] = 0;
    msg.sender.transfer(amount);
  }

  function getRequiredPayment(address collectionAddress, uint256 tokenId) public {
    License license = collectionLicenses[collectionAddress];
    assert(license != null, "no license defined");
    return license.artistRoyalty + license.ownerRoyalty + license.promoterCommission; // TODO Add the cost
  }
}
