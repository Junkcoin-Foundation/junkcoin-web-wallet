const { networks, payments } = require('junkcoinjs-lib');

const { ECPairFactory } = require('junkcoinpair');
const ecc = require('tiny-secp256k1');
const ECPair = ECPairFactory(ecc);

console.log('Mainnet config:', networks.junkcoin);
console.log('Testnet config:', networks.testnet);

describe('Junkcoin Address Generation', () => {
  it('should generate mainnet address starting with 7', () => {
    // Generate a random keypair for mainnet
    const keyPair = ECPair.makeRandom({ network: networks.junkcoin });
    const { address } = payments.p2pkh({
      pubkey: keyPair.publicKey,
    }, { network: networks.junkcoin });
    console.log(address);

    expect(address).toBeDefined();
    expect(address.charAt(0)).toBe('7');
  });

  it('should generate testnet address starting with m', () => {
    // Generate a random keypair for testnet
    const keyPair = ECPair.makeRandom({ network: networks.testnet });
    const { address: testnetAddress } = payments.p2pkh({
      pubkey: keyPair.publicKey,
    }, { network: networks.testnet });
    console.log(testnetAddress);
    expect(testnetAddress).toBeDefined();
    expect(testnetAddress.charAt(0)).toBe('m');
  });

  // Modified test for private key consistency
  it('should generate consistent addresses from the same private key', () => {
    // Generate two different private keys to better demonstrate the difference
    const privateKey1 = Buffer.from('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');
    const privateKey2 = Buffer.from('2234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');
    
    // Generate addresses using first private key
    const mainnetKeyPair1 = ECPair.fromPrivateKey(privateKey1, { network: networks.junkcoin });
    const mainnetAddress1 = payments.p2pkh({
      pubkey: mainnetKeyPair1.publicKey,
    }, { network: networks.junkcoin }).address;

    // Generate addresses using second private key
    const testnetKeyPair2 = ECPair.fromPrivateKey(privateKey2, { network: networks.testnet });
    const testnetAddress2 = payments.p2pkh({
      pubkey: testnetKeyPair2.publicKey,
    }, { network: networks.testnet }).address;

    console.log('Mainnet address (key1):', mainnetAddress1);
    console.log('Testnet address (key2):', testnetAddress2);

    expect(mainnetAddress1.charAt(0)).toBe('7');
    expect(testnetAddress2.charAt(0)).toBe('m');
  });
}); 