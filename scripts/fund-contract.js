const { Web3 } = require('web3');
const contractJSON = require('../build/contracts/RPSBetting.json');
require('dotenv').config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const CONTRACT_ADDRESS = '0x48290f81F582259c385bC3bebBc21d6f507b3C1E'; // From step 7
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Add this to .env

async function fundContract() {
    try {
        const web3 = new Web3(SEPOLIA_RPC_URL);

        const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);

        console.log(`Using account: ${account.address}`);

        const contract = new web3.eth.Contract(contractJSON.abi, CONTRACT_ADDRESS);

        const fundAmount = web3.utils.toWei('0.03', 'ether');

        console.log('Sending 0.03 ETH to contract...');

        const receipt = await contract.methods.depositFunds().send({
            from: account.address,
            value: fundAmount,
            gas: 500000
        });

        console.log(`✅ Transaction: https://sepolia.etherscan.io/tx/${receipt.transactionHash}`);

        const balance = await contract.methods.getContractBalance().call();
        console.log(`Contract balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);

    } catch (error) {
        console.error('Error:', error);
    }
}

fundContract();