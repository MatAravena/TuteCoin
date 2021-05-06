//const cryptoHash = require('./crypto-hash');
const INITIAL_DIFFICULTY = 1;
const MINE_RATE = 1000;

const GENESIS_DATA = {
    timestamp: new Date(),
    lastHash: "-----",
    hash: "hashPrimero",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: ["Primer Tute Coin !"]
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: '*authorized-reward*' };
const MINNING_REWARD = 50;

module.exports = {
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINNING_REWARD
};
