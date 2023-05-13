//SPDX-License-Identifier: None
pragma solidity >=0.4.22 <0.9.0;

contract ManageHash{
    function getHashFromAddress(address _add) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_add));
    }
}

contract Owned is ManageHash{
    //errors
    error OnlyOwner();

    //state variables
    bytes32 public owner;

    modifier onlyOwner() {
        if (owner != getHashFromAddress(msg.sender)) {
            revert OnlyOwner();
        }
        _;
    }

    //functions
    function setNewOwner(address newOwner) external onlyOwner {
        owner = getHashFromAddress(newOwner);
    }

    function getContractOwner() public view returns (bytes32) {
        return owner;
    }
}

contract TestContract is Owned {
    //structs
    struct Transact {
        address buyer;
        address seller;
        uint value;
        uint paymentDate1;
        uint paymentDate2;
    }

    //events

    //modifiers

    //external functions transaction, view pure

    //public functions transaction, view pure

    //internal functions transaction, view pure

    //private functions transaction, view pure
}
