// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../interfaces/IERC20Minimal.sol";

contract TestERC20 is IERC20Minimal {
  mapping(address => uint) public override balanceOf;
  mapping(address => mapping(address => uint)) public override allowance;

  constructor(uint amountToMint) {
    mint(msg.sender, amountToMint);
  }

  function mint(address to, uint amount) public {
    uint balanceNext = balanceOf[to] + amount;
    require(balanceNext >= amount, "overflow balance");
    balanceOf[to] = balanceNext;
  }

  function transfer(address recipient, uint amount) external override returns (bool) {
    uint balanceBefore = balanceOf[msg.sender];
    require(balanceBefore >= amount, "insufficient balance");
    balanceOf[msg.sender] = balanceBefore - amount;

    uint balanceRecipient = balanceOf[recipient];
    require(balanceRecipient + amount >= balanceRecipient, "recipient balance overflow");
    balanceOf[recipient] = balanceRecipient + amount;

    emit Transfer(msg.sender, recipient, amount);
    return true;
  }

  function approve(address spender, uint amount) external override returns (bool) {
    allowance[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address sender, address recipient, uint amount) external override returns (bool) {
    uint allowanceBefore = allowance[sender][msg.sender];
    require(allowanceBefore >= amount, "allowance insufficient");

    allowance[sender][msg.sender] = allowanceBefore - amount;

    uint balanceRecipient = balanceOf[recipient];
    require(balanceRecipient + amount >= balanceRecipient, "overflow balance recipient");
    balanceOf[recipient] = balanceRecipient + amount;
    uint balanceSender = balanceOf[sender];
    require(balanceSender >= amount, "underflow balance sender");
    balanceOf[sender] = balanceSender - amount;

    emit Transfer(sender, recipient, amount);
    return true;
  }
}
