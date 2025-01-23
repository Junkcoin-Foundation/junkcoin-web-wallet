const { networks } = require('junkcoinjs-lib');
const { ECPairFactory } = require('junkcoinpair');
const ecc = require('tiny-secp256k1'); // Ensure you have this library
const ECPair = ECPairFactory(ecc);

// Mock wallet object for demonstration purposes
const wallet = {
    keys: new Map(), // Store keys in a map
    addKey: function(keyPair, label) {
        const publicKey = keyPair.publicKey.toString('hex');
        this.keys.set(publicKey, { keyPair, label });
    },
    scanForWalletTransactions: function() {
        // Implement your scanning logic here
        console.log("Scanning for wallet transactions...");
    }
};

function importPrivKey(wifString, label = "", rescan = true) {
    // Decode the WIF string to get the key pair
    let keyPair;
    try {
        keyPair = ECPair.fromWIF(wifString, networks.testnet);
    } catch (error) {
        throw new Error("Invalid private key encoding: " + error.message);
    }

    const privateKey = keyPair.privateKey;
    const publicKey = keyPair.publicKey;

    console.log("Private Key (Hex): ", privateKey.toString('hex'));
    console.log("Public Key (Hex): ", publicKey.toString('hex'));

    console.log("Private key imported successfully.");
}

// Example usage
const wif = 'cRUgLRHeXgBuJR3qtG7rnXKNshbXENjzGoYoyZfoATsycGBKLxsB'; // Replace with a valid WIF
importPrivKey(wif, "My Label", true); 