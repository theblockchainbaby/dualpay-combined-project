const express = require('express');
const WebSocket = require('ws');
const xrpl = require('xrpl');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const lockFile = '.server.lock';
if (fs.existsSync(lockFile)) {
    console.error('Server is already running. Remove .server.lock to force start.');
    process.exit(1);
}
fs.writeFileSync(lockFile, process.pid.toString());

process.on('exit', () => {
    fs.unlinkSync(lockFile);
});

const wss = new WebSocket.Server({ port: 8081 }, () => {
    console.log('WebSocket server started on ws://localhost:8081');
});

wss.on('error', (error) => {
    console.error('WebSocket server error:', error.message);
});

let transactionHistory = [];

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    const balanceData = { type: 'balance', xrpBalance: '89.00', usdBalance: '215.38' };
    ws.send(JSON.stringify(balanceData));
    ws.send(JSON.stringify({ type: 'history', transactions: transactionHistory }));
    ws.on('message', (message) => console.log('Received from client:', message.toString()));
    ws.on('close', () => console.log('Client disconnected'));
});

let client;
let wallet;
let lastKnownPrice = 0;
let lastPriceFetchTime = 0;
const PRICE_CACHE_DURATION = 15 * 60 * 1000; // Increased to 15 minutes to avoid rate limiting
let isInitialized = false;

async function initialize() {
    if (isInitialized) {
        console.log('Already initialized, checking XRPL connection...');
        if (client && client.isConnected()) {
            console.log('XRPL connection is still active');
            return;
        } else {
            console.log('XRPL connection lost, reconnecting...');
            // Clean up previous client if it exists
            if (client) {
                try {
                    await client.disconnect();
                } catch (error) {
                    console.error('Error disconnecting previous XRPL client:', error.message);
                }
            }
        }
    }
    try {
        client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        client.on('connected', () => {
            console.log('Connected to XRPL WebSocket');
        });
        client.on('disconnected', (code) => {
            console.log('Disconnected from XRPL WebSocket, code:', code);
            isInitialized = false; // Allow reinitialization on next attempt
        });
        client.on('error', (error) => {
            console.error('XRPL WebSocket error:', error);
        });
        await client.connect();
        wallet = xrpl.Wallet.fromSeed('sEd7n8PDAjj1gKDL8JAtJH8PhHAywA8');
        console.log('Wallet initialized:', wallet.address);
        await updateBalance();
        isInitialized = true;
    } catch (error) {
        console.error('XRPL connection failed:', error.message);
        fs.unlinkSync(lockFile);
        process.exit(1);
    }
}

async function updateBalance() {
    try {
        if (!client || !client.isConnected()) {
            console.log('XRPL client not connected, attempting to reconnect...');
            await initialize();
        }
        const accountInfo = await client.request({
            command: 'account_info',
            account: wallet.address,
            ledger_index: 'validated',
        });
        const xrpBalance = accountInfo.result.account_data.Balance / 1000000;
        console.log('Fetched XRP balance:', xrpBalance);

        let xrpPrice = lastKnownPrice;
        const now = Date.now();
        if (now - lastPriceFetchTime >= PRICE_CACHE_DURATION) {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
                xrpPrice = lastKnownPrice = response.data.ripple.usd;
                lastPriceFetchTime = now;
                console.log('Fetched XRP price from CoinGecko:', xrpPrice);
            } catch (coinGeckoError) {
                console.error('CoinGecko API error:', coinGeckoError.message);
                xrpPrice = 2.42; // Hardcoded fallback
            }
        }
        const usdBalance = xrpBalance * xrpPrice;

        const balanceData = { xrpBalance: xrpBalance.toFixed(2), usdBalance: usdBalance.toFixed(2) };
        console.log('Broadcasting balance update to all clients:', balanceData);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                console.log('Sending balance update to client');
                client.send(JSON.stringify({ type: 'balance', ...balanceData }));
            }
        });
    } catch (error) {
        console.error('Balance update error:', error.message);
        // Attempt to reconnect on next update
        isInitialized = false;
    }
}

setInterval(updateBalance, 60000);

app.get('/balance', async (req, res) => {
    try {
        const accountInfo = await client.request({
            command: 'account_info',
            account: wallet.address,
            ledger_index: 'validated',
        });
        const xrpBalance = accountInfo.result.account_data.Balance / 1000000;
        console.log('HTTP /balance - Fetched XRP balance:', xrpBalance);

        let xrpPrice = lastKnownPrice;
        const now = Date.now();
        if (now - lastPriceFetchTime >= PRICE_CACHE_DURATION) {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
                xrpPrice = lastKnownPrice = response.data.ripple.usd;
                lastPriceFetchTime = now;
                console.log('HTTP /balance - Fetched XRP price from CoinGecko:', xrpPrice);
            } catch (coinGeckoError) {
                console.error('CoinGecko API error:', coinGeckoError.message);
                xrpPrice = 2.42; // Hardcoded fallback
            }
        }
        const usdBalance = xrpBalance * xrpPrice;
        const balanceData = { xrpBalance: xrpBalance.toFixed(2), usdBalance: usdBalance.toFixed(2) };
        console.log('HTTP /balance - Sending response:', balanceData);
        res.json(balanceData);
    } catch (error) {
        console.error('HTTP /balance - Balance fetch error:', error.message);
        res.status(500).json({ xrpBalance: '89.00', usdBalance: '215.38' });
    }
});

app.post('/send', async (req, res) => {
    const { amount, recipient, currency } = req.body;
    if (!amount || !recipient || !currency) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (currency !== 'XRP') {
        return res.status(400).json({ message: 'Only XRP supported' });
    }
    try {
        const amountInDrops = xrpl.xrpToDrops(amount);
        const payment = {
            TransactionType: 'Payment',
            Account: wallet.address,
            Amount: amountInDrops,
            Destination: recipient,
        };
        const ledgerResponse = await client.request({ command: 'ledger_current' });
        payment.LastLedgerSequence = ledgerResponse.result.ledger_current_index + 4;
        const prepared = await client.autofill(payment);
        const signedTx = wallet.sign(prepared);
        const result = await client.submitAndWait(signedTx.tx_blob);
        console.log('Payment result:', result);
        if (result.result.meta.TransactionResult === 'tesSUCCESS') {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'payment', status: 'success', tx: result.result }));
                }
            });
            await updateBalance();
            const transaction = {
                name: 'Test Recipient',
                date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' }),
                amount: `-${amount}`,
                type: 'negative',
                txHash: result.result.hash
            };
            transactionHistory.push(transaction);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'transaction', transaction }));
                    client.send(JSON.stringify({ type: 'history', transactions: transactionHistory }));
                }
            });
            res.json({ message: 'Payment sent successfully', txHash: result.result.hash });
        } else {
            res.status(500).json({ message: 'Payment failed on ledger', result: result.result.meta.TransactionResult });
        }
    } catch (error) {
        console.error('Payment error:', error.message);
        res.status(500).json({ message: 'Payment failed: ' + error.message });
    }
});

app.post('/fiat-payment', (req, res) => {
    const { amount, currency } = req.body;
    if (!amount || !currency) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (currency !== 'USD') {
        return res.status(400).json({ message: 'Only USD supported for fiat' });
    }
    setTimeout(() => {
        const transaction = {
            name: 'Fiat Payment',
            date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' }),
            amount: `-${amount}`,
            type: 'negative',
            txId: 'FIAT-' + Date.now()
        };
        transactionHistory.push(transaction);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'transaction', transaction }));
                client.send(JSON.stringify({ type: 'history', transactions: transactionHistory }));
            }
        });
        res.json({ message: 'Fiat payment processed successfully', txId: transaction.txId });
    }, 2000);
});

initialize().then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running at http://0.0.0.0:${port}`);
    });
}).catch((error) => {
    console.error('Initialization error:', error.message);
    fs.unlinkSync(lockFile);
    process.exit(1);
});