# DevOPS - RPS Betting Game

This project demonstrates a fully functional blockchain-based betting game with smart contract technology. Players bet cryptocurrency (test, not real money) on the outcome of an autonomous Rock-Paper-Scissors simulation where they battle until only one type remains.

# Manual installation

### 1. Install Backend Dependencies
```bash
npm install express cors web3 body-parser dotenv
npm install -g http-server
```

### 2. Create .env file
```bash
MNEMONIC="kiwi there energy noble panda reflect corn cargo echo gravity search embrace"
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/LkiAFeBAOtY2PCSUvSVKU"
PRIVATE_KEY="6500f80b4ec4a8d70e992f8ad089e7d8f900b55d6152a03513a177a29e5d40f3"
```

### Running the application manually (every time):

### Terminal 1: Backend server
```bash
node backend-server.js
```

### Terminal 2: Frontend server
```bash
cd public
http-server -p 8080
```

# Docker
```bash
cp .env.example .env
# Edit .env with your credentials (MNEMONIC, SEPOLIA_RPC_URL, PRIVATE_KEY, REDIS_PASSWORD)

docker-compose build
docker-compose up -d
```

# Docker with BuildX
```bash
cp .env.example .env
# Edit .env with your credentials

docker-compose -f docker-compose.buildx.yml build
docker-compose -f docker-compose.buildx.yml up -d
```