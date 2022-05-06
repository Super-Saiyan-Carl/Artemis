require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');

const VoteToken = artifacts.require("CarlCoin");
const VoteHandler = artifacts.require("VoteHandler");

contract("VoteHandler", (accounts) => {
    const ONE_VOTE = BigInt(1e18);
    const HALF_VOTE = ONE_VOTE / BigInt(2);
    const INITIAL_VOTES = BigInt(10e18);
    const APPROVAL_AMOUNT = BigInt(1000000e18);
    let contract;
    let CC

    before(async () => {
        CC = await VoteToken.deployed();

        contract = await VoteHandler.deployed();
        await contract.pause(false);
        await CC.mint(accounts[0], INITIAL_VOTES);
        await CC.mint(accounts[2], INITIAL_VOTES);

        await CC.approve(contract.address, APPROVAL_AMOUNT, {from: accounts[0]});
    });

    describe("can vote from accounts[0]", async () => {
        it("can vote for APPLE", async () => {
            const vote_for_apple_response = await contract.vote(ONE_VOTE, "APPLE", {from: accounts[0]});
            assert.equal(await contract.getVoteCount.call("APPLE"), ONE_VOTE, "vote recorded for APPLE");
        });
        it("can vote for BROCCOLI", async () => {
            await contract.vote(ONE_VOTE, "BROCCOLI", {from: accounts[0]});
            assert.equal(await contract.getVoteCount.call("BROCCOLI"), ONE_VOTE, "vote recorded for BROCCOLI");
        });
        it("can vote again for APPLE", async () => {
            await contract.vote(HALF_VOTE, "APPLE", {from: accounts[0]});
            assert.equal(await contract.getVoteCount.call("APPLE"), ONE_VOTE + HALF_VOTE, "vote tally added to APPLE");
        });
        after("can retrieve multiple vote tallys simultaneously", async () => {
            const ans = (await contract.getVoteCounts.call(["BROCCOLI", "APPLE"])).map( e => e.toString() );
            assert.equal(ans, [ONE_VOTE, ONE_VOTE + HALF_VOTE].toString(), "votes correctly retrieved");
        });
    });
    describe("cannot vote from account[1] without tokens", async () => {
        it("cannot vote for APPLE without approval and without tokens", async () => {
            expectRevert(contract.vote(ONE_VOTE, "APPLE", {from: accounts[1]}), "ERC20: transfer amount exceeds balance");
        });
        it("cannot vote for APPLE without tokens", async () => {
            await CC.approve(contract.address, APPROVAL_AMOUNT, {from: accounts[1]});
            expectRevert(contract.vote(ONE_VOTE, "APPLE", {from: accounts[1]}), "ERC20: transfer amount exceeds balance");
        });
    });
    describe("cannot vote from account[2] without approval", async () => {
        it("cannot vote for APPLE without approval", async () => {
            expectRevert(contract.vote(ONE_VOTE, "APPLE", {from: accounts[2]}), "ERC20: transfer amount exceeds allowance");
        });
    });
    describe("can be paused", async () => {
        it("owner can pause contract", async () => {
            await contract.pause(true, {from: accounts[0]});
        });
        it("non-owner cannot pause contract", async () => {
            expectRevert(contract.pause(false, {from: accounts[1]}), "Ownable: caller is not the owner");
        });
        it("cannot vote for paused contract", async () => {
            expectRevert(contract.vote(ONE_VOTE, "APPLE", {from: accounts[0]}), "This contract is paused, most functions are unavailable");
            expectRevert(contract.vote(ONE_VOTE, "APPLE", {from: accounts[1]}), "This contract is paused, most functions are unavailable");
        });
        after("owner can restore contract", async () => {
            await contract.pause(false, {from: accounts[0]});
            assert.equal(await contract.is_paused.call(), false);
        });
    });
});
