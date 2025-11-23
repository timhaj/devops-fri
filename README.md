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

# Vagrant
To run the app using vagrant:
```bash
git clone https://github.com/timhaj/devops-fri
cd devops-fri
// create .env file and add the contents above ^
vagrant up
```

# cloud-init
To run the app using cloud-init:
```bash
git clone https://github.com/timhaj/devops-fri
cd devops-fri

sudo cloud-init clean --logs
sudo cloud-init init --local
sudo cloud-init init
sudo cloud-init modules --mode=config
sudo cloud-init modules --mode=final
```