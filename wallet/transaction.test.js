const { verifySignature } = require("../util");
const Wallet = require("./index");
const Transaction = require("./transaction");

describe("Transacion", () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = "recipient-public-key";
        amount = 50;
        transaction = new Transaction({ senderWallet, recipient, amount });
    });

    it("has an 'id'", () => {
        expect(transaction).toHaveProperty("id");
    });

    describe("outPutMap", () => {
        it("has an 'outPutMap'", () => {
            expect(transaction).toHaveProperty("outputMap");
        });

        it("Outputs the amount to the recipient", () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it("Outputs the remainig balance for the 'senderWallet'", () => {
            expect(transaction.outputMap[senderWallet.publicKey]).
                toEqual(senderWallet.balance - amount);
        });
    });

    describe("inputs ", () => {
        it("has an 'input'", () => {
            expect(transaction).toHaveProperty('input');
        });

        it("has an 'timestamp' in the input", () => {
            expect(transaction.input).toHaveProperty('timestamp');
        });

        it("sets the 'amount' to the 'snderWallet' balance", () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it("sets the 'address' to the 'senderWallet' publicKey", () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it("sign the input", () => {
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })).toBe(true);
        });
    });

    describe("validTransaction() ", () => {
        describe("When the transaction is valid", () => {
            it("returns true", () => {
                expect(Transaction.validTransaction(transaction)).toBe(true);
            });
        });

        describe("When the transaction is invalid", () => {
            let errorMock;

            beforeEach(() => {
                errorMock = jest.fn();
                global.console.error = errorMock;
            });

            describe("and a transaction outputMap value is invalid", () => {
                it("returns false and logs an errors", () => {

                    transaction.outputMap[senderWallet.publicKey] = 9999;

                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe("and a transaction input signature is invalid", () => {
                it("returns false and logs an errors", () => {

                    transaction.input.signature = new Wallet().sign("data");

                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

        });
    });
});
