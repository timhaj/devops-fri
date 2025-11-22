const { Web3 } = require('web3'); // Note the destructured import
const contractJSON = require('../build/contracts/RPSBetting.json');

// Configuration
const GANACHE_URL = 'http://127.0.0.1:7545';
const CONTRACT_ADDRESS = '0xD23Bfc6f3d25BAfeC0885d00E72856a1974CB98F'; // Update with your deployed address

async function fundContract() {
    try {
        console.log('Connecting to Ganache...');
        const web3 = new Web3(GANACHE_URL);

        // Get accounts
        const accounts = await web3.eth.getAccounts();
        const ownerAccount = accounts[0];

        console.log(`Using owner account: ${ownerAccount}`);

        // Get owner balance
        const ownerBalance = await web3.eth.getBalance(ownerAccount);
        console.log(`Owner balance: ${web3.utils.fromWei(ownerBalance, 'ether')} ETH`);

        // Initialize contract
        const contract = new web3.eth.Contract(contractJSON.abi, CONTRACT_ADDRESS);

        // Check current contract balance
        const currentBalance = await contract.methods.getContractBalance().call();
        console.log(`Current contract balance: ${web3.utils.fromWei(currentBalance, 'ether')} ETH`);

        // Fund amount (10 ETH)
        const fundAmount = web3.utils.toWei('10', 'ether');

        console.log('\nSending 10 ETH to contract...');

        const receipt = await contract.methods.depositFunds().send({
            from: ownerAccount,
            value: fundAmount,
            gas: 500000
        });

        console.log(`✅ Transaction successful!`);
        console.log(`Transaction hash: ${receipt.transactionHash}`);

        // Check new balance
        const newBalance = await contract.methods.getContractBalance().call();
        console.log(`\nNew contract balance: ${web3.utils.fromWei(newBalance, 'ether')} ETH`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error funding contract:', error.message);
        process.exit(1);
    }
}

fundContract();