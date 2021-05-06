const bodyParser = require("body-parser");

//ExpressJS
const express = require('express');
//Request Http
const request = require("request");

const BlockChain = require("./blockchain");
const PubSub = require("./app/pubsub");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet");
const { response } = require("express");

const app = express();
const blockchain = new BlockChain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();

const pubsub = new PubSub({ blockchain, transactionPool });




const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

// setTimeout(() => {
//     pubsub.broadcastChain()
// }, 1000);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    res.redirect("/api/blocks");
});

app.post('/api/transact', (req, res) => {

    const { amount, recipient } = req.body;
    let transaction = transactionPool.existingTransaction({ inputAdress: wallet.publicKey });

    try {
        if (transaction)
            transaction.update({ senderWallet: wallet, amount, recipient });
        else
            transaction = wallet.createTransaction({ amount, recipient });
    }
    catch (error) {
        return res.status(404).json({ type: 'error', message: error.message });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'sucess', transaction });
});

app.get("/api/transaction-pool-map", (req, res) => {
    res.json(transactionPool.transactionMap);
})

const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log("replace chain on a async with", rootChain);
            blockchain.replaceChain(rootChain);
        }
    })

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log("replace transaction pool map on a sync with", rootTransactionPoolMap);

            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
};

// Multi ports dinamyc
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT +
        Math.ceil(Math.random() * 1000);
    console.log("Puerto ", PEER_PORT);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost: ${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
})
