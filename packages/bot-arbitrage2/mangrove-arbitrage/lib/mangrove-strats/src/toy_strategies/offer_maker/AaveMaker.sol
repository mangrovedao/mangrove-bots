// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {OfferMaker} from "./OfferMaker.sol";
import {AaveV3Borrower} from "@mgv-strats/src/strategies/integrations/AaveV3Borrower.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {AbstractRouter} from "@mgv-strats/src/strategies/routers/abstract/AbstractRouter.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";
import {MgvLib} from "@mgv/src/core/MgvLib.sol";

contract AaveMaker is OfferMaker, AaveV3Borrower {
  mapping(address => address) public reserves;
  bytes32 constant retData = "lastLook/testData";

  // router_ needs to bind to this contract
  // since one cannot assume `this` is admin of router, one cannot do this here in general
  constructor(IMangrove mgv, AbstractRouter router_, address deployer, uint gasreq, address addressesProvider)
    OfferMaker(mgv, router_, deployer, gasreq, deployer) // setting reserveId = deployer by default
    AaveV3Borrower(addressesProvider, 0, 1)
  {}

  function __lastLook__(MgvLib.SingleOrder calldata) internal virtual override returns (bytes32) {
    return retData;
  }

  function __posthookSuccess__(MgvLib.SingleOrder calldata order, bytes32 maker_data)
    internal
    override
    returns (bytes32 data)
  {
    data = super.__posthookSuccess__(order, maker_data);
    require(
      data == REPOST_SUCCESS || data == COMPLETE_FILL,
      (data == "mgv/insufficientProvision")
        ? "mgv/insufficientProvision"
        : (data == "mgv/writeOffer/density/tooLow" ? "mgv/writeOffer/density/tooLow" : "posthook/failed")
    );
  }

  function supply(IERC20 token, uint amount) public onlyAdmin {
    _supply(token, amount, address(this), false);
  }

  function borrow(IERC20 token, uint amount) public onlyAdmin {
    _borrow(token, amount, address(this));
  }

  function approveLender(IERC20 token, uint amount) public onlyAdmin {
    _approveLender(token, amount);
  }

  function executeOperation(address token, uint, /* amount */ uint, /* fees */ address, bytes calldata) external {
    _approveLender(IERC20(token), type(uint).max);
    // console.log("flashloaned %s for a fee of %s", amount, fees);
  }

  function flashLoan(IERC20 token, uint amount) public onlyAdmin {
    POOL.flashLoanSimple(address(this), address(token), amount, new bytes(0), 0);
  }
}
