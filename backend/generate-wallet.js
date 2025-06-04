const xrpl = require('xrpl');

async function generateWallet() {
  const wallet = xrpl.Wallet.generate();
  console.log('New Wallet:', {
    address: wallet.classicAddress,
    seed: wallet.seed
  });
}

generateWallet().catch((error) => {
  console.error('Error generating wallet:', error);
});
