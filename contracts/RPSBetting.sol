// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RPSBetting {
    enum Element {
        Rock,
        Paper,
        Scissors
    }

    struct Game {
        address player;
        uint256 betAmount;
        Element prediction;
        bool active;
        bool resolved;
        Element winner;
    }

    mapping(uint256 => Game) public games;
    uint256 public gameCounter;

    event GameCreated(
        uint256 indexed gameId,
        address indexed player,
        uint256 betAmount,
        Element prediction
    );
    event GameResolved(
        uint256 indexed gameId,
        address indexed player,
        bool won,
        uint256 payout
    );

    // House (contract owner) can withdraw funds
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // Player creates a game by betting
    function createGame(
        Element _prediction
    ) external payable returns (uint256) {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(
            address(this).balance >= msg.value * 2,
            "Insufficient contract balance for payout"
        );

        uint256 gameId = gameCounter++;
        games[gameId] = Game({
            player: msg.sender,
            betAmount: msg.value,
            prediction: _prediction,
            active: true,
            resolved: false,
            winner: Element.Rock // placeholder
        });

        emit GameCreated(gameId, msg.sender, msg.value, _prediction);
        return gameId;
    }

    // Resolve the game (called from backend after simulation completes)
    function resolveGame(uint256 _gameId, Element _winner) external onlyOwner {
        Game storage game = games[_gameId];
        require(game.active, "Game is not active");
        require(!game.resolved, "Game already resolved");

        game.winner = _winner;
        game.resolved = true;
        game.active = false;

        bool won = (game.prediction == _winner);
        uint256 payout = 0;

        if (won) {
            // Player wins: get 2x their bet
            payout = game.betAmount * 2;
            payable(game.player).transfer(payout);
        }
        // If lost, house keeps the bet (already in contract)

        emit GameResolved(_gameId, game.player, won, payout);
    }

    // Owner can deposit funds to ensure contract can pay winners
    function depositFunds() external payable onlyOwner {
        require(msg.value > 0, "Must deposit some funds");
    }

    // Owner can withdraw excess funds (but should maintain enough for active games)
    function withdrawFunds(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(owner).transfer(_amount);
    }

    // Get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Get game details
    function getGame(
        uint256 _gameId
    )
        external
        view
        returns (
            address player,
            uint256 betAmount,
            Element prediction,
            bool active,
            bool resolved,
            Element winner
        )
    {
        Game memory game = games[_gameId];
        return (
            game.player,
            game.betAmount,
            game.prediction,
            game.active,
            game.resolved,
            game.winner
        );
    }
}
