// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol" ;

contract FellowshipOfTheRingCollection is ERC1155, Ownable {
    
    string public name;
    string public symbol;
    string public baseUriPath;
    uint256 public tokenCounter;

    constructor(string memory _name, string memory _symbol, string memory _baseUriPath) ERC1155(_baseUriPath) {
        name = _name;
        symbol = _symbol;
        baseUriPath = _baseUriPath;
    }

    function mint(uint256 tokenAmount) public onlyOwner {
        tokenCounter += 1;
        _mint(msg.sender, tokenCounter, tokenAmount, "");
    }

    // Overriding uri function for compatibility between OpenZeppelin and OpenSea
    function uri(uint256 _tokenId) override public view returns (string memory) {
        return string (
            abi.encodePacked(
                baseUriPath,
                Strings.toString(_tokenId),
                ".json"
            )
        );
    }

    function burn(address _from, uint256 _tokenId, uint256 _amount) public onlyOwner {
        _burn(_from, _tokenId, _amount);
    }
}