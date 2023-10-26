// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {IERC20} from "@mgv/lib/IERC20.sol";
import {AbstractRouter} from "./AbstractRouter.sol";

///@title `MonoRouter` instances have a sourcing strategy which is reserveId and caller independent.
///@dev `routerGasreq(address reserveId)` is thus a constant function.
abstract contract MonoRouter is AbstractRouter {
  ///@notice the router specific gas requirement
  uint public immutable ROUTER_GASREQ;

  ///@notice Constructor
  ///@param routerGasreq_ the router specific gas requirement
  constructor(uint routerGasreq_) {
    ROUTER_GASREQ = routerGasreq_;
  }

  ///@inheritdoc AbstractRouter
  function __routerGasreq__(IERC20, address) internal view override returns (uint) {
    return ROUTER_GASREQ;
  }
}
