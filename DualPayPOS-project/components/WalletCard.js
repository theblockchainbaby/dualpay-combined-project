import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as xrpl from 'xrpl';

const XRP_TESTNET_ADDRESS = 'rUBfehyXqJaiej5n6WF2re3MARewCVVwf4'; // Replace if needed

export default function WalletCard() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        console.log('🔗 Connecting to XRPL Testnet');
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();
        console.log('✅ Connected');

        const response = await client.request({
          command: 'account_info',
          account: XRP_TESTNET_ADDRESS,
          ledger_index: 'validated',
        });

        const rawBalance = response.result.account_data.Balance;
        setBalance(xrpl.dropsToXrp(rawBalance));
        await client.disconnect();
      } catch (err) {
        console.error('❌ XRPL Error:', err.message);
        setError('Error fetching balance');
      }
    }

    fetchBalance();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 XRP Wallet</Text>
      {balance && <Text style={styles.balance}>Balance: {balance} XRP</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  balance: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
});