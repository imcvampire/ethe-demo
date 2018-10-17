pragma solidity ^0.4.24;

contract Cloth {
    //Address of manager
    address public owner;

    struct Item {
        uint count;
        bytes8 dateManufacture;
        bytes8 dateExpiry;
    }

    //Mapping from id item to detail infor
    mapping (uint => Item) items;
    uint itemCount;
    //Mapping from item index to buyer
    mapping (uint => address) buyers;


    //contructor
    constructor() public {
        owner = msg.sender;
    }


    //Add item (Manager mode)
    function addItem(uint count, bytes8 dateManufacture, bytes8 dateExpiry) public onlyByManager {
        Item memory item = Item(count, dateManufacture, dateExpiry);
        items[itemCount] = item;

        //Icrease count variable
        itemCount++;
    }

    modifier onlyByManager() {
        require(msg.sender == owner);
        _;
    }

    //Buy function for user mode
    function buy(uint itemId) public returns(uint) {

        require(itemId >= 0 && itemId < itemCount && items[itemId].count > 0);
        //Set buyer to
        buyers[itemId] = msg.sender;

        //Set count for item
        items[itemId].count--;

        return itemId;
    }

    //Get infor of clothes from it's id
    function getCloth(uint id) public view returns (uint count, bytes8, bytes8){
        Item memory item = items[id];

        return (item.count, item.dateManufacture, item.dateExpiry);
    }
}
