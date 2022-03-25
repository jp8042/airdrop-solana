const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');

const log = require('npmlog');

const newPair = new Keypair();

const publicKey = new PublicKey(newPair._keypair.publicKey).toString();

const { secretKey } = newPair._keypair;

const getWalletBalance = async () => {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const myWallet = await Keypair.fromSecretKey(secretKey);
    const walletBalance = await connection.getBalance(
      new PublicKey(myWallet.publicKey),
    );
    log.info('   getWalletBalance :: For wallet address: %j', publicKey);
    log.info(`   Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL}SOL`);
  } catch (err) {
    log.error(err);
  }
};

const airDropSol = async () => {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const walletKeyPair = await Keypair.fromSecretKey(secretKey);
    log.info('-- Airdropping 2 SOL --');
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(walletKeyPair.publicKey),
      2 * LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(fromAirDropSignature);
  } catch (err) {
    log.error(err);
  }
};

(async () => {
  await getWalletBalance();
  await airDropSol();
  await getWalletBalance();
})();
