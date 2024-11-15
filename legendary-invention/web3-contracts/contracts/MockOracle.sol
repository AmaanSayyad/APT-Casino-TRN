// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockOracle {
    int256 private price;

    constructor(int256 initialPrice) {
        price = initialPrice;
    }

    function getLatestPrice() external view returns (int256) {
        return price;
    }

    function updatePrice(int256 newPrice) external {
        price = newPrice;
    }
}
