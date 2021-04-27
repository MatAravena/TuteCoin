const redis = require("redis");

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN"
};

class PubSub {

    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();

        this.subscriber.on(
            "message",
            (channel, message) => {
                this.handlerMessage(channel, message);
            });
    }

    handlerMessage(channel, message) {
        console.log(`Message recieved. Channel: ${channel}. Message:${message}`);

        const parsedMessage = JSON.parse(message);
        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        })

        // this.subscriber.subscribe(CHANNELS);
        // this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
    }

    publish({ channel, message }) {
        this.publisher.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }
}

module.exports = PubSub;
// const testPubSub = new PubSub();
// setTimeout(() =>
//     testPubSub.publisher.publish(CHANNELS.TEST, "prueba"),
//     1000);
