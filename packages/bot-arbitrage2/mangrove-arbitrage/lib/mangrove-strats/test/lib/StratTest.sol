// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import "@mgv/test/lib/MangroveTest.sol";
import "@mgv-strats/src/strategies/utils/AccessControlled.sol";

contract StratTest is MangroveTest {
  function $(AccessControlled t) internal pure returns (address payable) {
    return payable(address(t));
  }
}
