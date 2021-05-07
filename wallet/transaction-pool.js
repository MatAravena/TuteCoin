const Transaction = require("./transaction")

class TransacionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }

    existingTransaction({ inputAddress }) {
        const transactions = Object.values(this.transactionMap);
        return transactions.find(transaction => transaction.input.address === inputAddress);
    }

    validTransactions() {
        return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)
        );
    }

    clear() {
        this.transactionMap = {};
    }

    clearBlockchainTransactions({ chain }) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            for (let tran of block.data) {
                if (this.transactionMap[tran.id]) {
                    delete this.transactionMap[tran.id];
                }
            }
        }
    }
}

module.exports = TransacionPool;