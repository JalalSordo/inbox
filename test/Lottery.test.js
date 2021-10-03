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

    it("can allow players to enter", async () => {
        //in case if you using diffrent fraction of ether
        //web3.utils.toWei('0.02','ether');
        await deployedContract.methods.enter().send({ from: fetchedAcccounts[1], value: 2 });
        await deployedContract.methods.enter().send({ from: fetchedAcccounts[2], value: 2 });
        await deployedContract.methods.enter().send({ from: fetchedAcccounts[3], value: 2 });
        await deployedContract.methods.enter().send({ from: fetchedAcccounts[4], value: 2 });
        const players = await deployedContract.methods.getAllPLayers().call();
        assert.equal(players.length, 4)
        assert.equal(players[0], fetchedAcccounts[1])
        assert.equal(players[1], fetchedAcccounts[2])
        assert.equal(players[2], fetchedAcccounts[3])
        assert.equal(players[3], fetchedAcccounts[4])
        const prize = await deployedContract.methods.getCurrentPrize().call();
        assert.equal(prize, 8)
    });

    it("can requires a minimum value to enter", async () => {
        try {
            await deployedContract.methods.enter().send({ from: fetchedAcccounts[1], value: 1 });
            //in case it goes here.
            assert(false)
        } catch (err) {
            //only check if its defined
            assert(err)
        }
    });

    it("only allows manager to pick winner", async () => {
        try {
            await deployedContract.methods.enter().send({ from: fetchedAcccounts[1], value: 2 });
            await deployedContract.methods.enter().send({ from: fetchedAcccounts[2], value: 2 });
            await deployedContract.methods.pickWinner().send({ from: fetchedAcccounts[1] });
            //inc ase it goes here.
            //we use becasue assert module helper function not good with async await
            assert(false)
        } catch (err) {
            //only check if its defined
            assert(err);

        }
    });
    it("can allow a player to win", async () => {
        console.log("before entering")
        console.log(await web3.eth.getBalance(fetchedAcccounts[1]))
        console.log(await web3.eth.getBalance(fetchedAcccounts[2]))
        await deployedContract.methods.enter().send({ from: fetchedAcccounts[1], value: 2 });
        await deployedContract.methods.enter().send({ from: fetchedAcccounts[2], value: 2 });
        console.log("after entering")
        console.log(await web3.eth.getBalance(fetchedAcccounts[1]))
        console.log(await web3.eth.getBalance(fetchedAcccounts[2]))
        let players = await deployedContract.methods.getAllPLayers().call();
        assert.equal(players.length, 2)
        let prize = await deployedContract.methods.getCurrentPrize().call();
        assert.equal(prize, 4)
        await deployedContract.methods.pickWinner().send({ from: fetchedAcccounts[0] });
        console.log("after wining")
        console.log(await web3.eth.getBalance(fetchedAcccounts[1]))
        console.log(await web3.eth.getBalance(fetchedAcccounts[2]))
        players = await deployedContract.methods.getAllPLayers().call();
        assert.equal(players.length, 0)
        prize = await deployedContract.methods.getCurrentPrize().call();
        assert.equal(prize, 0)


    });
})


