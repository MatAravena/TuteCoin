const cryptoHash = require("./crypto-hash");

describe("cryptoHash()", () => {
    it("generates a SHA-256 hashed utput", () => {
        expect(cryptoHash("TuteCoin"))
            .toEqual("1788b48c31074dc543af3322d6266076d1e9b20c6dad6695b6898ed5643544b9");
    });

    it("Produces the same hash wth the same input arguments in any order", () => {
        expect(cryptoHash("one", "two", "three"))
            .toEqual(cryptoHash("three", "two", "one"));
    });

    it("ceates a SHA256 'hash' based on the proper inputs", () => {
        expect(minedBlock.hash)
            .toEqual(cryptoHash(minedBlock.timeStamp, lastBlock, data));
    });

});
