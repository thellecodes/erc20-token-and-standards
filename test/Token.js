const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let erc20Token;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    erc20Token = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
            arguments: ['1000'],
        })
        .send({ from: accounts[0], gas: '1000000' });
});

describe("ERC20Token", () => {
    it("Deploys ERC20 token", async () => {
        assert.ok(erc20Token.options.address);
    })

    it("Checks the total supply of the token deployed", async () => {
        assert.equal(await erc20Token.methods.allSupply().call(), 1000);
    })

    it("Transfers a token from account a to account B", async () => {
        await erc20Token.methods.transfer(accounts[1], 100).send({ from: accounts[0] });
        const balance = await erc20Token.methods.balanceOf(accounts[0]).call();
        assert.equal(balance, 900);
    })

    it("Approves another wallet to spend tokens from deployer account", async () => {
        const a = await erc20Token.methods.approve(accounts[1], 400)
            .send({ from: accounts[0] });
        assert.ok(a.transactionHash);
    })

    it("Allows a peer transaction from approved account", async () => {
        await erc20Token.methods.transferFrom(accounts[0], accounts[2], 100)
            .send({ from: accounts[1] })
        const balance = await erc20Token.methods.balanceOf(accounts[2]).call();
        assert.equal(balance, 100);
    })
});