const cryptoHash = require("./crypto-hash");

describe("cryptoHash()", () => {
    it("generates a SHA-256 hashed utput", () => {
        expect(cryptoHash("TuteCoin"))
            .toEqual("3017ee4a4c5fc7f2bd8b5e3790bd8adad3d7d1b2cdf851b2a32a3ba5ab0c7192");
    });

    it("Produces the same hash wth the same input arguments in any order", () => {
        expect(cryptoHash("one", "two", "three"))
            .toEqual(cryptoHash("three", "two", "one"));
    });

    // it("ceates a SHA256 'hash' based on the proper inputs", () => {
    //     expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timeStamp, lastBlock, data));
    // });

    it("produces a unique hash when the properties have changed on an input", () => {
        const foo = {};
        const originalHash = cryptoHash(foo);

        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});
