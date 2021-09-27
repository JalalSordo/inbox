const assert = require('assert');
const ganach = require('ganache-cli');
const Web3 = require('web3');//becasause its contructor function
const web3 = new Web3(ganach.provider());
const { compileContract } = require("../compile")


let fetchedAcccounts;
let deployedContract;
const contract = compileContract('Lottery');
beforeEach(async () => {
    //GEt a list of all accounts
    fetchedAcccounts = await web3.eth.getAccounts();
    //Use one of these accounts to deploy the contract in the local eth test network
    deployedContract = await new web3.eth.Contract(JSON.parse(contract.interface))
        .deploy({ data: contract.bytecode })
        .send({ from: fetchedAcccounts[0], gas: '1000000' })

});

describe("deployed", () => {
    it("deploys a contract", () => {
        assert.ok(deployedContract.options.address)
    });
})


