import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WalletCard() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    </View>
  );
}

const styles = StyleSheet.create({
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

