// Importing the necessary modules
const { networks } = require('junkcoinjs-lib');
const { ECPairFactory } = require('junkcoinpair');
const ecc = require('tiny-secp256k1');
const { payments } = require('junkcoinjs-lib');
const crypto = require('crypto');

// Create an instance of ECPairAPI
const ECPair = ECPairFactory(ecc);

// Replace this with a valid WIF starting with 'N' for Junkcoin Core
const wif = 'cRUgLRHeXgBuJR3qtG7rnXKNshbXENjzGoYoyZfoATsycGBKLxsB';  // Put your valid WIF private key here

try {
  // Decoding the WIF key
  const keyPair = ECPair.fromWIF(wif, networks.testnet);
  const privateKey = keyPair.privateKey;
  const publicKey = keyPair.publicKey;

  // Generate address from public key
  const { address } = payments.p2pkh({
    pubkey: publicKey,
    network: networks.testnet
  });

  console.log("Private Key (Hex): ", privateKey.toString('hex'));
  console.log("Public Key (Hex): ", publicKey.toString('hex'));
  console.log("Address: ", address);

} catch (error) {
  console.error("Failed to decode WIF:", error);
}
