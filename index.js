//Native JS Module 
const bodyParser = require("body-parser");
const path = require('path');

//ExpressJS
const express = require('express');

//Request Http
const request = require("request");

const BlockChain = require("./blockchain");
const PubSub = require("./app/pubsub");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet");
const TransactionMiner = require("./app/transaction-miner");
const { RedisClient } = require("redis");

const blockchain = new BlockChain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

// setTimeout(() => {
//     pubsub.broadcastChain()
// }, 1000);

const app = express();
var cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Let the js in the Client folder can be serv
app.use(express.static(path.join(__dirname, "client/dist")));

//CORS
app.use(cors());
// SPECIFIC PORT
// app.listen(1234, function () {
//     console.log('CORS-enabled web server listening on port 80')
// })
// SPECIFIC URL
// var corsOptions = {
//     origin: 'http://localhost:1234/',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

//Http methods
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
            transaction = wallet.createTransaction({
                amount,
                recipient,
                chain: blockchain.chain
            });
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
});

app.get("/api/mine-transactions", (req, res) => {
    transactionMiner.mineTransactions();

    res.redirect("/api/blocks")
});

app.get("/api/wallet-info", (req, res) => {
    const address = wallet.publicKey;

    res.json({
        address: address,
        balance: Wallet.calculateBalance({
            chain: blockchain.chain,
            address: address
        })
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

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


// Tests
const walletTutin = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
}


const walletTutinPrimeroAction = () => generateWalletTransaction({
    wallet: walletTutin, recipient: walletBar.publicKey, amount: 10
});
const walletAction = () => generateWalletTransaction({
    wallet, recipient: walletTutin.publicKey, amount: 10
});
const walletTutinAction = () => generateWalletTransaction({
    wallet: walletTutin, recipient: walletBar.publicKey, amount: 10
});
const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar, recipient: wallet.publicKey, amount: 5
});

for (let i = 0; i <= 10; i++) {
    if (i == 0) {
        walletTutinPrimeroAction();
    } else {
        if (i % 3 == 0) {
            walletAction();
            walletTutinAction();
        }
        else if (i % 3 == 1) {
            walletAction();
            walletBarAction();
        } else {
            walletTutinAction();
            walletAction();
        }
    }


    transactionMiner.mineTransactions();
}
// TEST - END




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
