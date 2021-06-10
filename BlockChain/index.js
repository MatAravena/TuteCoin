const Block = require("./block");
const { cryptoHash } = require("../util");
const { REWARD_INPUT, MINNING_REWARD } = require("../config");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");

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

    replaceChain(chain, validTransaction, onSuccess) {
        if (chain.length <= this.chain.length) {
            console.error("The incoming chain must be longer");
            return;
        }

        if (!BlockChain.isValidChain(chain)) {
      console.error('The incoming chain must be valid');
            return;
        }

        if (validTransaction && !this.validTransactionData({ chain })) {
            console.error('The incoming chain has invalid data');
            return;
        }

        if (onSuccess) onSuccess();

        console.log("replaciong chain with", chain);
        this.chain = chain;
    }

    validTransactionData({ chain }) {

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const tranSet = new Set();
            let rewardTransactionCount = 0;


            // FIX CRYPTO ADDREESS of Rewards inputs !!

            for (let tran of block.data) {
                if (tran.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error("Miner rewards exceed limit");
                        return false;
                    }

                    if (Object.values(tran.outputMap)[0] !== MINNING_REWARD) {
                        console.error("Miner reward amount is invalid");
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(tran)) {
                        console.error("Invalid transaction");
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: tran.input.address
                    });

                    if (tran.input.amount !== trueBalance) {
                        console.error("invalid input amount");
                        return false;
                    }

                    if (tranSet.has(tran)) {
                        console.error("An identical transaction appears more than once in the block")
                        return false;
                    } else {
                        tranSet.add(tran);
                    }

                }
            }
        }

        return true;
    }
    
    
    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;

        for (let i = 1; i < chain.length; i++) {
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
}

module.exports = BlockChain;