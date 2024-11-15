// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Oracle {
    function getLatestPrice() external view returns (int256);
}

contract OracleIntegration {
    Oracle public oracle;

    constructor(address _oracle) {
        oracle = Oracle(_oracle);
    }

    // Get the latest price from the oracle
    function getPrice() external view returns (int256) {
        return oracle.getLatestPrice();
    }
}
