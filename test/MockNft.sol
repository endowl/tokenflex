pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockNft is ERC721, Ownable {
    constructor() ERC721("TestToken", "TEST") Ownable() {}

    function mint(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
    }
}