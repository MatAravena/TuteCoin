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

    // describe("validTransactions()", () => {
    //     let validTransactions, errorMock;

    //     beforeEach(() => {
    //         validTransactions = [];
    //         errorMock = jest.fn();
    //         global.console.error = errorMock;

    //         for (let i = 0; i < 6; i++) {
    //             transaction = new Transaction({
    //                 senderWallet,
    //                 recipient: "any-recipient",
    //                 amount: 30
    //             });

    //             if (i % 3 === 0) {
    //                 transaction.input.amount = 9999999;
    //             } if (i % 3 === 1) {
    //                 transaction.input.signature = new Wallet().sign("foo");
    //             }
    //             else {
    //                 validTransactions.push(transaction);
    //             }

    //             transactionPool.setTransaction(transaction);
    //         }
    //     });

    //     it('returns valid transaction', () => {
    //         expect(transactionPool.validTransactions()).toEqual(validTransactions);
    //     });

    //     it("logs errors for the invalid transactions", () => {
    //         transactionPool.validTransactions();
    //         expect(errorMock).toHaveBeenCalled();
    //     });
    // });

    describe('validTransactions()', () => {
        let validTransactions, errorMock;

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn();
            global.console.error = errorMock;

            for (let i = 0; i < 10; i++) {
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'any-recipient',
                    amount: 30
                });

                if (i % 3 === 0) {
                    transaction.input.amount = 999999;
                } else if (i % 3 === 1) {
                    transaction.input.signature = new Wallet().sign('foo');
                } else {
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            }
        });

        it('returns valid transaction', () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it('logs errors for the invalid transactions', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });

});
