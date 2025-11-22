// Backend service to securely resolve RPS games
// Install: npm install express cors web3 body-parser

const express = require('express');
const cors = require('cors');
const { Web3 } = require('web3'); // Fixed import
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuration
const PORT = 3000;
const GANACHE_URL = 'http://127.0.0.1:7545';
const CONTRACT_ADDRESS = '0xD23Bfc6f3d25BAfeC0885d00E72856a1974CB98F'; // Update after deployment
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "betAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum RPSBetting.Element",
                "name": "prediction",
                "type": "uint8"
            }
        ],
        "name": "GameCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "won",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "payout",
                "type": "uint256"
            }
        ],
        "name": "GameResolved",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "gameCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "games",
        "outputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "betAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum RPSBetting.Element",
                "name": "prediction",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "resolved",
                "type": "bool"
            },
            {
                "internalType": "enum RPSBetting.Element",
                "name": "winner",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "enum RPSBetting.Element",
                "name": "_prediction",
                "type": "uint8"
            }
        ],
        "name": "createGame",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_gameId",
                "type": "uint256"
            },
            {
                "internalType": "enum RPSBetting.Element",
                "name": "_winner",
                "type": "uint8"
            }
        ],
        "name": "resolveGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "depositFunds",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_gameId",
                "type": "uint256"
            }
        ],
        "name": "getGame",
        "outputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "betAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum RPSBetting.Element",
                "name": "prediction",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "resolved",
                "type": "bool"
            },
            {
                "internalType": "enum RPSBetting.Element",
                "name": "winner",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
]; // Update with your contract ABI

// Web3 setup
const web3 = new Web3(GANACHE_URL);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

// Owner account (first Ganache account) - this resolves games
let ownerAccount;

// Initialize
async function init() {
    const accounts = await web3.eth.getAccounts();
    ownerAccount = accounts[0]; // First Ganache account is the owner
    console.log('Backend initialized with owner account:', ownerAccount);
    console.log('Contract address:', CONTRACT_ADDRESS);
}

// Store active games (in production, use a database)
const activeGames = new Map();

// Endpoint: Notify backend that a game has started
app.post('/api/game/started', async (req, res) => {
    try {
        const { gameId, player, prediction } = req.body;

        console.log(`Game ${gameId} started by ${player}, prediction: ${prediction}`);

        // Store game info
        activeGames.set(gameId, {
            player,
            prediction,
            startTime: Date.now(),
            resolved: false
        });

        res.json({ success: true, message: 'Game registered' });
    } catch (error) {
        console.error('Error registering game:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint: Resolve a game
app.post('/api/game/resolve', async (req, res) => {
    try {
        const { gameId, winner } = req.body;

        if (!activeGames.has(gameId)) {
            return res.status(404).json({ success: false, error: 'Game not found' });
        }

        const game = activeGames.get(gameId);
        if (game.resolved) {
            return res.status(400).json({ success: false, error: 'Game already resolved' });
        }

        // Map winner string to enum
        const winnerMap = { 'rock': 0, 'paper': 1, 'scissors': 2 };
        const winnerEnum = winnerMap[winner.toLowerCase()];

        if (winnerEnum === undefined) {
            return res.status(400).json({ success: false, error: 'Invalid winner' });
        }

        console.log(`Resolving game ${gameId}: winner is ${winner} (${winnerEnum})`);

        // Call smart contract to resolve game
        const result = await contract.methods.resolveGame(gameId, winnerEnum).send({
            from: ownerAccount,
            gas: 500000
        });

        console.log(`Game ${gameId} resolved. Transaction: ${result.transactionHash}`);

        // Mark as resolved
        game.resolved = true;
        game.resolvedAt = Date.now();
        game.winner = winner;
        game.txHash = result.transactionHash;

        // Get game details from contract
        const gameDetails = await contract.methods.getGame(gameId).call();
        const playerWon = parseInt(gameDetails.prediction) === winnerEnum;

        res.json({
            success: true,
            gameId,
            winner,
            playerWon,
            txHash: result.transactionHash
        });
    } catch (error) {
        console.error('Error resolving game:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint: Get game status
app.get('/api/game/:gameId', async (req, res) => {
    try {
        const gameId = req.params.gameId;

        // Get from blockchain
        const gameDetails = await contract.methods.getGame(gameId).call();

        const elementNames = ['Rock', 'Paper', 'Scissors'];

        res.json({
            success: true,
            game: {
                player: gameDetails.player,
                betAmount: web3.utils.fromWei(gameDetails.betAmount, 'ether'),
                prediction: elementNames[gameDetails.prediction],
                active: gameDetails.active,
                resolved: gameDetails.resolved,
                winner: gameDetails.resolved ? elementNames[gameDetails.winner] : null
            }
        });
    } catch (error) {
        console.error('Error getting game:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint: Get contract balance
app.get('/api/contract/balance', async (req, res) => {
    try {
        const balance = await contract.methods.getContractBalance().call();
        res.json({
            success: true,
            balance: web3.utils.fromWei(balance, 'ether')
        });
    } catch (error) {
        console.error('Error getting balance:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint: Fund contract (owner only, for testing)
app.post('/api/contract/fund', async (req, res) => {
    try {
        const { amount } = req.body; // amount in ETH

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, error: 'Invalid amount' });
        }

        const amountWei = web3.utils.toWei(amount.toString(), 'ether');

        const result = await contract.methods.depositFunds().send({
            from: ownerAccount,
            value: amountWei,
            gas: 500000
        });

        const newBalance = await contract.methods.getContractBalance().call();

        res.json({
            success: true,
            txHash: result.transactionHash,
            newBalance: web3.utils.fromWei(newBalance, 'ether')
        });
    } catch (error) {
        console.error('Error funding contract:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'RPS Betting Backend is running',
        owner: ownerAccount,
        contract: CONTRACT_ADDRESS
    });
});

// Start server
app.listen(PORT, async () => {
    await init();
    console.log(`\n🎮 RPS Betting Backend running on http://localhost:${PORT}`);
    console.log(`📡 Connected to Ganache at ${GANACHE_URL}`);
    console.log(`📄 Contract: ${CONTRACT_ADDRESS}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down backend...');
    process.exit(0);
});