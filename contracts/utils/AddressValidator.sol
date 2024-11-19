// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AddressValidator
 * @dev Utility library for address validation
 */
library AddressValidator {
    
    /**
     * @dev Checks if address is valid (not zero)
     */
    function isValid(address addr) internal pure returns (bool) {
        return addr != address(0);
    }
    
    /**
     * @dev Checks if address is a contract
     */
    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
    
    /**
     * @dev Validates array of addresses
     */
    function validateAddresses(address[] memory addresses) internal pure returns (bool) {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (!isValid(addresses[i])) {
                return false;
            }
            
            // Check for duplicates
            for (uint256 j = i + 1; j < addresses.length; j++) {
                if (addresses[i] == addresses[j]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    /**
     * @dev Requires address to be valid
     */
    function requireValid(address addr) internal pure {
        require(isValid(addr), "AddressValidator: zero address");
    }
}

