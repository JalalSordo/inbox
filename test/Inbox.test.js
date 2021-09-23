const assert = require('assert');
const ganach = require('ganache-cli');
const Web3 = require('web3');//becasause its contructor function
const web3 = new Web3(ganach.provider());
const { interface, bytecode } = require("../compile")


let fetchedAcccounts;
let deployedInbox;
beforeEach(async () => {
    //GEt a list of all accounts
    fetchedAcccounts = await web3.eth.getAccounts();
    //Use one of these accounts to deploy teh contract in the local eth test network
    deployedInbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi Jalal from SC'] })
        .send({ from: fetchedAcccounts[0], gas: '1000000' })

});

describe("Inbox", () => {
    it("deploys a contract", () => {
        assert.ok(deployedInbox.options.address)
    });

    it("has a default message", async () => {
        const message = await deployedInbox.methods.getMessage().call();
        console.log(message);
        assert.equal(message, 'Hi Jalal from SC')
    });

    it("message does update", async () => {
       await deployedInbox.methods.setMessage("TEST DATA").send({from:fetchedAcccounts[0]});
       const message = await deployedInbox.methods.getMessage().call();
       console.log(message);
       assert.equal(message, 'TEST DATA')
    });
})


