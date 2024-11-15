// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ICosmos } from "@initia/evm-precompiles/i_cosmos/ICosmos.sol";

contract ContractA {

    // Method to convert a Cosmos address to an EVM address
    function to_evm_address(
        string memory cosmos_address
    ) external returns (address evm_address) {
        // Converts and returns the EVM address corresponding to the given Cosmos address
        return ICosmos.COSMOS_CONTRACT.to_evm_address(cosmos_address);
    }
}