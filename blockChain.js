const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class BlockChain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);

    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;

        for (let i = 1; i < chain.length - 1; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const actualLastHash = chain[i - 1].hash;
            const lastDiff = chain[i - 1].difficulty;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (hash !== validatedHash) return false;
            if (Math.abs(lastDiff - difficulty) > 1) return false;
        }
        return true;
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error("The incoming chain must be longer");
            return;
        }

        if (!BlockChain.isValidChain(chain)) {
            console.error("The incoming chain is invalid");
            return;
        }

        console.log("Que sucede ?", chain);
        console.log("replaciong chain with", chain);
        this.chain = chain;
    }
}

module.exports = BlockChain;