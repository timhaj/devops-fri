# Quick Start Guide - RPS Betting Game

## Installation Steps (Do Once)

### 1. Install Backend Dependencies
```bash
npm install express cors web3 body-parser dotenv http-server
```

If error with http-server: "npm install -g http-server"

### 2. Deploy Smart Contract
```bash
# Start Ganache (keep it running)
# Then in your project directory:
npx truffle compile
npx truffle migrate --network development
```

**Important:** Copy the contract address from the output!

### 3. Configure Files

**A. Get Contract ABI:**
- Open `build/contracts/RPSBetting.json`
- Copy the entire `"abi"` array (starts with `[` and ends with `]`)

**B. Update Backend (`backend-server.js`):**
```javascript
const CONTRACT_ADDRESS = '0xYourContractAddress'; // Line 14
const CONTRACT_ABI = [...]; // Line 15 - paste ABI here
```

**C. Update Frontend (`public/index.html`):**
```javascript
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS'; // Line 147
const CONTRACT_ABI = [...]; // Line 148 - paste ABI here
```

### 4. Fund the Contract
```bash
node scripts/fund-contract.js
```

## Running the Application (Every Time)

### Terminal 1: Ganache
```bash
# Just open the Ganache application
# Or run: ganache-cli
```

### Terminal 2: Backend Server
```bash
node backend-server.js
```
You should see:
```
🎮 RPS Betting Backend running on http://localhost:3000
📡 Connected to Ganache at http://127.0.0.1:7545
📄 Contract: 0x...
```

### Terminal 3: Frontend Server
```bash
cd public
http-server -p 8080
```

### Browser
1. Open: http://localhost:8080
2. Connect MetaMask (using Ganache network)
3. Start playing!

## File Structure

```
rps-betting-game/
├── contracts/
│   └── RPSBetting.sol          # Smart contract
├── migrations/
│   └── 2_deploy_contracts.js   # Deployment script
├── scripts/
│   └── fund-contract.js        # Fund contract script
├── public/
│   ├── index.html              # Frontend (with backend)
│   ├── rock.png
│   ├── paper.png
│   └── scissor.png
├── backend-server.js           # Backend API
├── truffle-config.js           # Truffle configuration
└── package.json
```

## MetaMask Setup

1. **Add Ganache Network:**
   - Network Name: `Ganache Local`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency: `ETH`

2. **Import Account:**
   - In Ganache, click the key icon next to any account
   - Copy the private key
   - In MetaMask: Import Account → paste key

## Testing the Game

1. **Connect Wallet** - Click "Connect MetaMask"
2. **Choose Prediction** - Select Rock, Paper, or Scissors
3. **Set Bet Amount** - Default is 0.1 ETH
4. **Place Bet** - Approves transaction in MetaMask
5. **Watch Simulation** - Game runs automatically
6. **Get Result** - Backend resolves on blockchain
7. **Play Again** - Click to reset and bet again

## API Endpoints

The backend provides these endpoints:

- `GET /api/health` - Health check
- `POST /api/game/started` - Register new game
- `POST /api/game/resolve` - Resolve game (backend only)
- `GET /api/game/:gameId` - Get game details
- `GET /api/contract/balance` - Get contract balance
- `POST /api/contract/fund` - Fund contract (owner only)

## Next Steps

- Add more visual effects to the game
- Implement leaderboard
- Add game history
- Deploy to testnet (Sepolia)
- Add proper authentication
- Implement Chainlink VRF for true randomness

## Security Notes

⚠️ **This is for local testing only!**

For production:
- Never expose private keys
- Use proper authentication
- Implement rate limiting
- Add comprehensive error handling
- Conduct security audits
- Use Chainlink VRF for randomness
- Implement proper backend security