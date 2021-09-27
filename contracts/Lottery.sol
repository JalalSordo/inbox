pragma solidity ^0.4.17; //version to be used of solidity

contract Lottery {
    address public manager;
    address[] public players;

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 1 wei);
        players.push(msg.sender);
    }

    function getCurrentBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function pickWinner() public onlyManagerCanCall {
        require(msg.sender == manager);
        uint256 index = random() % players.length;
        players[index].transfer(getCurrentBalance());
        players = new address[](0);
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(block.difficulty, now, players));
    }

    modifier onlyManagerCanCall() {
        require(msg.sender == manager);
        _;
    }
}
