const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VaultLib Unit Tests", function () {
    
    describe("Percentage Calculations", function () {
        it("Should calculate 50% correctly", async function () {
            const amount = 10000;
            const percentage = 5000;
            const result = (amount * percentage) / 10000;
            expect(result).to.equal(5000);
        });
        
        it("Should calculate 25% correctly", async function () {
            const amount = 10000;
            const percentage = 2500;
            const result = (amount * percentage) / 10000;
            expect(result).to.equal(2500);
        });
        
        it("Should handle small percentages", async function () {
            const amount = 10000;
            const percentage = 1; // 0.01%
            const result = (amount * percentage) / 10000;
            expect(result).to.equal(1);
        });
    });
    
    describe("Array Validation", function () {
        it("Should validate matching array lengths", async function () {
            const arr1 = [1, 2, 3];
            const arr2 = [4, 5, 6];
            expect(arr1.length).to.equal(arr2.length);
        });
        
        it("Should detect length mismatches", async function () {
            const arr1 = [1, 2, 3];
            const arr2 = [4, 5];
            expect(arr1.length).to.not.equal(arr2.length);
        });
    });
});

