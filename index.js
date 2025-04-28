const fs = require('fs');
const { ethers } = require('ethers');
const colors = require('colors');
const logger = require('./logger');
const { provider, CHAIN_ID, checkNetworkSync } = require('./provider');
const { fetchRandomImage, prepareImageData, uploadToStorage } = require('./upload');

// Load setting.json
const settings = JSON.parse(fs.readFileSync('setting.json', 'utf8'));

let privateKeys = [];
let proxies = [];
let currentKeyIndex = 0;

function loadPrivateKeys() {
  privateKeys = fs.readFileSync('privatekeys.txt', 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

function loadProxies() {
  proxies = fs.readFileSync('proxies.txt', 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

function initializeWallet() {
  const privateKey = privateKeys[currentKeyIndex];
  return new ethers.Wallet(privateKey, provider);
}

async function main() {
  try {
    logger.banner();
    loadPrivateKeys();
    loadProxies();

    logger.loading('Checking network status...');
    const network = await provider.getNetwork();
    if (BigInt(network.chainId) !== BigInt(CHAIN_ID)) {
      throw new Error(`Invalid chainId: expected ${CHAIN_ID}, got ${network.chainId}`);
    }
    logger.success(`Connected to network: chainId ${network.chainId}`);

    const isNetworkSynced = await checkNetworkSync();
    if (!isNetworkSynced) {
      throw new Error('Network is not synced');
    }

    console.log(colors.cyan + "Available wallets:" + colors.reset);
    privateKeys.forEach((key, index) => {
      const wallet = new ethers.Wallet(key);
      console.log(`${colors.green}[${index + 1}]${colors.reset} ${wallet.address}`);
    });
    console.log();

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    while (true) { // infinite loop
      logger.section(`Starting new daily upload session`);

      for (let walletIndex = 0; walletIndex < privateKeys.length; walletIndex++) {
        currentKeyIndex = walletIndex;
        const wallet = initializeWallet();
        logger.section(`Processing Wallet #${walletIndex + 1} [${wallet.address}]`);

        for (let i = 1; i <= settings.upload_per_wallet; i++) {
          const uploadNumber = (walletIndex * settings.upload_per_wallet) + i;
          logger.process(`Upload ${uploadNumber} (Wallet #${walletIndex + 1}, File #${i})`);

          try {
            const imageBuffer = await fetchRandomImage();
            const imageData = await prepareImageData(imageBuffer);
            await uploadToStorage(imageData, wallet, walletIndex);
            logger.success(`Upload ${uploadNumber} complete!`);
          } catch (error) {
            logger.error(`Upload failed: ${error.message}`);
          }

          // Delay random antar upload
          const randomDelay = Math.floor(Math.random() * (settings.max_delay_seconds - settings.min_delay_seconds + 1)) + settings.min_delay_seconds;
          logger.info(`Waiting ${randomDelay} seconds before next upload...`);
          await delay(randomDelay * 1000);
        }
      }

      logger.section(`All uploads for today done! Waiting 24 hours before next session.`);

      // Tunggu 24 jam sebelum mulai lagi
      await delay(24 * 60 * 60 * 1000);
    }
  } catch (error) {
    logger.critical(error.message);
    process.exit(1);
  }
}

main();
