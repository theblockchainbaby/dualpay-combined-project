const { Wallet } = require('xrpl');
const seed = 'sEd7oS7pWhHoNyzrJkeSSnT4xZ8NCRm';
const wallet = Wallet.fromSeed(seed);
console.log('Address:', wallet.address);

