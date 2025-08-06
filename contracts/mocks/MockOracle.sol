// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockOracle {
    mapping(bytes32 => bytes) public responses;
    
    function setResponse(bytes32 requestId, bytes calldata response) external {
        responses[requestId] = response;
    }
    
    function getResponse(bytes32 requestId) external view returns (bytes memory) {
        return responses[requestId];
    }
}

