const bodyParser = require("body-parser");

//ExpressJS
const express = require('express');
//Request Http
const request = require("request");

const BlockChain = require("./blockChain");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new BlockChain();
const pubsub = new PubSub({ blockchain });


const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

setTimeout(() => {
    pubsub.broadcastChain()
}, 1000);

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

const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log("replace chain on a async with", rootChain);
            blockchain.replaceChain(rootChain);
        }
    })
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
    syncChains();
})
