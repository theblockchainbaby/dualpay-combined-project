import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
=======
import * as xrpl from 'xrpl';

const XRP_TESTNET_ADDRESS = 'rUBfehyXqJaiej5n6WF2re3MARewCVVwf4'; // Replace if needed
>>>>>>> merge-dualpay-pos

export default function WalletCard() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
    fetch('http://192.168.0.216:3000/balance') // your local server IP
      .then((res) => res.json())
      .then((data) => setBalance(data))
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to load balance');
      });
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>DualPay Wallet</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : balance ? (
        <>
          <Text style={styles.amount}>💰 XRP: {balance.xrpBalance}</Text>
          <Text style={styles.amount}>💵 USD: ${balance.usdBalance}</Text>
        </>
      ) : (
        <Text style={styles.loading}>Loading balance...</Text>
      )}
=======
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
>>>>>>> merge-dualpay-pos
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  card: {
    width: '90%',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#000', // black card
    marginTop: 40,
    alignSelf: 'center',
    shadowColor: '#00bfff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  amount: {
    fontSize: 20,
    color: '#00bfff',
    marginVertical: 4,
    textAlign: 'center',
  },
  loading: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

=======
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
>>>>>>> merge-dualpay-pos
