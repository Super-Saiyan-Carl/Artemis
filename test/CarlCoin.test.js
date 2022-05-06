require("chai");

const VoteToken = artifacts.require("CarlCoin");

contract("CarlCoin", (accounts) => {
    const MINT_AMOUNT = 1e2;
    let contract;

    before(async () => {
        contract = await VoteToken.deployed();
    });

    describe("minting to owner address and retrieving balance", async () => {
        before(`mint ${MINT_AMOUNT} tokens to accounts[0]`, async () => {
            console.log(accounts[0]);
            await contract.mint(accounts[0], MINT_AMOUNT);
        });
        it("can fetch balance including newly minted amount", async () => {
            let balance = await contract.balanceOf.call(accounts[0]);
            assert.equal(MINT_AMOUNT, balance, "the minted amount should be present in the user's balance");
        });
    });

    describe("check for permission violations", async () => {
        it("can fetch balance", async () => {
            let balance = await contract.balanceOf.call(accounts[0], {from: accounts[1]});
            assert.equal(balance >= 0, true, "the balance should be retrieved");
        });
    });
});
