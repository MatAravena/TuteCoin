const cryptoHash = require('./crypto-hash');

const GENESIS_DATA = {
    timestamp: new Date(),
    lastHash: "-----",
    hash: cryptoHash("hashPrimero"),
    data: [cryptoHash("Primer Tute Coin !")]
};

module.exports = { GENESIS_DATA };
