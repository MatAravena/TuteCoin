const express = require('express');
const bodyParser = require("body-parser");

const BlockChain = require("./blockChain");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new BlockChain();
const pubsub = new PubSub({ blockchain });

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

    res.redirect("/api/blocks");

});

const PORT = 5500
app.listen(PORT, () => {
    console.log(`listening at localhost: ${PORT}`);
})
