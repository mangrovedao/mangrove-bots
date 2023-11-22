// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

library AaveV3BorrowerStorage {
  // address of the lendingPool
  // struct Layout {
  // }

  // function getStorage() internal pure returns (Layout storage st) {
  //   bytes32 storagePosition = keccak256(
  //     "Mangrove.AaveV3BorrowerStorageLib.Layout"
  //   );
  //   assembly {
  //     st.slot := storagePosition
  //   }
  // }

  function revertWithData(bytes memory retdata) internal pure {
    if (retdata.length == 0) {
      revert("AaveModuleStorage/revertNoReason");
    }
    assembly {
      revert(add(retdata, 32), mload(retdata))
    }
  }
}
