// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CourseMarketplace {

    enum State{
        Purchased,
        Activated,
        Deactivated
    }

    struct Course{
        uint id;
        uint price;
        bytes32 proof;
        address owner;
        State state;
    }

    //mapping of courseHash to Course Data
    mapping(bytes32 => Course) private ownedCourses;

    //mapping of courseId to courseHash
    //aqui eu tenho a informação codificada do curso/wallet que adquiriu
    mapping(uint => bytes32) private ownedCourseHash;

    //number of all courses + id of the courses
    uint private totalOwnedCourses;

    //contract owner
    address payable private owner;

    //errors
    ///Courser has already a owner
    error CourseHasOwner();
    //only owner
    error OnlyOwner();

    //modifiers
    modifier onlyOwner {
        if(msg.sender != owner){
            revert OnlyOwner();
        }
        _;
    }

    constructor(){
        setContractOwner(msg.sender);
    }

    function purchaseCourse(bytes16 courseId, bytes32 proof) external payable {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        
        if (hasCourseOwnership(courseHash)){
            revert CourseHasOwner();
        }
        
        uint id = totalOwnedCourses++;
        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            proof: proof,
            owner: msg.sender,
            state: State.Purchased
        });
    }

    function transferOwnership(address payable newContractOwner) external{

        setContractOwner(newContractOwner);
    }

    //getter functions
    function getCourseCount() external view returns (uint){
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint index) external view returns(bytes32){
        return ownedCourseHash[index];
    }

    function getCourseByHash(bytes32 courseHash) external view returns(Course memory){
        return ownedCourses[courseHash];
    }

    function getContractOwner() public view returns (address){
        return owner;
    }

    function setContractOwner(address newOwner) private{
        owner = payable(newOwner);
    }

    function hasCourseOwnership(bytes32 courseHashParam) private view returns(bool){
        return ownedCourses[courseHashParam].owner == msg.sender;
    }
}
