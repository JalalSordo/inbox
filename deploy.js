const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');//becasause its contructor function
const { interface, bytecode } = require("./compile")



const provider = new HDWalletProvider("hockey kite dog curve enlist sick glue middle slender dentist carry beach",
    "https://ropsten.infura.io/v3/a5c57bbb4114492ebb051a84486341d7")
const web3 = new Web3(provider);

const deploy = async () => {
    const fetchedAcccounts = await web3.eth.getAccounts();
    console.log(fetchedAcccounts);

    const deployedInbox = await new web3.eth.Contract("JSON.parse(interface)")
        .deploy({ data: bytecode, arguments: ['Hi Jalal from SC'] })
        .send({ gas: '1000000', gasPrice: '5000000000', from: fetchedAcccounts[0] });
        console.log(deployedInbox.options.address)

}
deploy();

