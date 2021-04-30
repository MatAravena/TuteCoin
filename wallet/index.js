const { STARTING_BALANCE } = require("../config");
const Transaction = require("./transaction");

// Index queda como archivo defecto de directorio y se obvia en la llamada
//const { ec } = require("../util/index");
const { ec, cryptoHash } = require("../util");

class Wallet {

    constructor() {
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode("hex");
    }

    sign(data) {
        // Sign the message's hash (input must be an array, or a hex-string)
        // var msgHash = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        // var signature = key.sign(msgHash);

        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({ amount, recipient }) {
        if (this.balance < amount)
            throw new Error("Amount exceeds balance");

        return new Transaction({ senderWallet: this, recipient, amount });
    }
}

module.exports = Wallet;