import "../../../../../contracts/libraries/BitMath.sol";

contract VerifyBitMathMsb {
  function verify(uint x) external {
    uint msb = BitMath.mostSignificantBit(x);

    bool property = x >= 2 ** msb && (msb == 255 || x < 2 ** (msb + 1));

    require(!property);
  }
}
