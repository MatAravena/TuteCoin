const { verifySignature } = require("../util");

const Wallet = require("./index");
const Transaction = require("./transaction");
const TransactionPool = require("./transaction-pool");

describe("TransacionPool", () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: "fake-recipient",
            amount: 150
        });
    });

    describe("setTransaction", () => {
        it("adds a transaction", () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id])
                .toBe(transaction);
        });
    });

    describe("existingTransaction()", () => {
        it("returns an existing transaction given an input address", () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey }))
                .toBe(transaction);
        });
    });

});
