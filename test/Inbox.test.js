const assert = require('assert');
const ganach = require('ganache-cli');
const Web3 = require('web3');//becasause its contructor function
const web3 = new Web3(ganach.provider());
const { compileContract } = require("../compile")


let fetchedAcccounts;
let deployedContract;
const contract = compileContract('Inbox');
beforeEach(async () => {
    //GEt a list of all accounts
    fetchedAcccounts = await web3.eth.getAccounts();
    //Use one of these accounts to deploy teh contract in the local eth test network
    deployedContract = await new web3.eth.Contract(JSON.parse(contract.interface))
        .deploy({ data: contract.bytecode, arguments: ['Hi Jalal from SC'] })
        .send({ from: fetchedAcccounts[0], gas: '1000000' })

});

describe("deployed", () => {
    it("deploys a contract", () => {
        assert.ok(deployedContract.options.address)
    });

    it("has a default message", async () => {
        const message = await deployedContract.methods.getMessage().call();
        console.log(message);
        assert.equal(message, 'Hi Jalal from SC')
    });

    it("message does update", async () => {
        await deployedContract.methods.setMessage("TEST DATA").send({ from: fetchedAcccounts[0] });
        const message = await deployedContract.methods.getMessage().call();
        console.log(message);
        assert.equal(message, 'TEST DATA')
    });
})


