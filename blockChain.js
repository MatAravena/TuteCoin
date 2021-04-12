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
            const { timestamp, lastHash, hash, data } = chain[i];
            const actualLastHash = chain[i - 1].hash;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data);

            if (hash !== validatedHash) return false;
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

        console.log("replaciong chain with", chain);
        this.chain = chain;
    }
}

module.exports = BlockChain;