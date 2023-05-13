// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
  
  struct Purchase {
    uint purchaseDate;
    uint refundUntil;
    uint earnAfter;
    uint value;
    bool refunded;
    bool earned;
  }

  bool public isStopped = false;
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
  error AlreadyRefunded();
  error AlreadyEarned();
  error EarnNotAllowed();
  error ErrorOnRefund();

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
    uint courseId, uint daysToRefund, uint daysToEarn
  )
    external
    payable
    onlyWhenNotStopped
  {
    coursePurchased[msg.sender][courseId] = Purchase(
      {purchaseDate: block.timestamp,
      refundUntil: block.timestamp + (daysToRefund * 1 days) ,
      value: msg.value,
      earnAfter: block.timestamp + (daysToEarn * 1 days),
      refunded: false,
      earned: false
      });
  }

  function refundCourse(
    uint courseId
  ) external onlyWhenNotStopped returns (bool){
    Purchase storage purchase = getPurchasedCourse(courseId);
    if (block.timestamp > purchase.refundUntil ){
      revert RefundNotAllowed();
    }
    if(purchase.refunded){
      revert AlreadyRefunded();
    }
    //refunding
    purchase.refunded = true;
    (bool refunded, ) =payable(msg.sender).call{value: purchase.value}("");
    if (!refunded){
      revert ErrorOnRefund();
    }
    return true;
  }

  function earnCourse(
    uint courseId
  ) external onlyWhenNotStopped returns (bool){
    Purchase storage purchase = getPurchasedCourse(courseId);
    if(block.timestamp < purchase.earnAfter || purchase.refunded == true){
      revert EarnNotAllowed();
    }
    if (purchase.earned){
      revert AlreadyEarned();
    }
    
    //earning
    purchase.earned = true;
    (bool refunded, ) = payable(msg.sender).call{value: purchase.value}("");
    if (!refunded){
      revert ErrorOnRefund();
    }
    return true;
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

  function getPurchasedCourse(uint courseId) private view returns(Purchase storage){
    return coursePurchased[msg.sender][courseId];
  }

  function setContractOwner(address newOwner) private {
    owner = payable(newOwner);
  }

}

