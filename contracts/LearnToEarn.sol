// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
  
  struct Purchase {
    uint purchaseDate;
    uint refundUntil;
    uint value;
    bool refunded;
  }

  bool public isStopped = false;
  uint public daysToRefund = 7;
  address payable private owner;

  //wallet buyer => (courseId => purchase)
  mapping(address => mapping (uint => Purchase)) coursePurchased;
  
  uint marketplaceFees;

  constructor() {
    setContractOwner(msg.sender);
  }

  /// Only owner has an access!
  error OnlyOwner();
  error RefundNotAllowed();

  modifier onlyOwner() {
    if (msg.sender != getContractOwner()) {
      revert OnlyOwner();
    }
    _;
  }

  modifier onlyWhenNotStopped {
    require(!isStopped);
    _;
  }

  modifier onlyWhenStopped {
    require(isStopped);
    _;
  }

  receive() external payable {}

  function withdraw(uint amount)
    external
    onlyOwner
  {
    (bool success, ) = owner.call{value: amount}("");
    require(success, "Transfer failed.");
  }

  function emergencyWithdraw()
    external
    onlyWhenStopped
    onlyOwner
  {
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success, "Transfer failed.");
  }

  function selfDestruct()
    external
    onlyWhenStopped
    onlyOwner
  {
    selfdestruct(owner);
  }

  function stopContract()
    external
    onlyOwner
  {
    isStopped = true;
  }

  function resumeContract()
    external
    onlyOwner
  {
    isStopped = false;
  }

  function purchaseCourse(
    uint courseId
  )
    external
    payable
    onlyWhenNotStopped
  {
    coursePurchased[msg.sender][courseId] = Purchase(
      {purchaseDate: block.timestamp,
      refundUntil: block.timestamp + 7 days ,
      value: msg.value,
      refunded: false});
  }

  function refundCourse(
    uint courseId
  ) external onlyWhenNotStopped{
    Purchase storage purchase = coursePurchased[msg.sender][courseId];
    if (block.timestamp > purchase.refundUntil){
      revert RefundNotAllowed();
    }

  }

  function transferOwnership(address newOwner)
    external
    onlyOwner
  {
    setContractOwner(newOwner);
  }

  function getContractOwner()
    public
    view
    returns (address)
  {
    return owner;
  }

  function setContractOwner(address newOwner) private {
    owner = payable(newOwner);
  }

}
