pragma solidity ^0.4.17;

contract Shop {
  address[16] public buyers;

  // Adopting a pet
  function buy(uint clothId) public returns (uint) {
    require(clothId >= 0 && clothId <= 15);

    buyers[clothId] = msg.sender;

    return clothId;
  }

  // Retrieving the buyers
  function getBuyers() public view returns (address[16]) {
    return buyers;
  }
}
