// contracts/TodoList2.sol
pragma solidity ^0.6.3;

contract TodoList2 {
    string[] private list;

    // Emitted when the storeda new item is added to the list
    event ItemAdded(string item);

    // Adds a new item in the list
    function addItem(string memory newItem) public {
        list.push(newItem);
        emit ItemAdded(newItem);
    }

    // Gets the item from the list according to index
    function getListItem(uint256 index)
        public
        view
        returns (string memory item)
    {
        return list[index];
    }

    // Gets the size of the list
    function getListSize() public view returns (uint256 size) {
        return list.length;
    }
}
