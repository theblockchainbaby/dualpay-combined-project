import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SwapScreen() {
  const navigation = useNavigation();
  const [xrpAmount, setXrpAmount] = useState('589');
  const eurRate = 0.2473;
  const eurAmount = (parseFloat(xrpAmount) * eurRate).toFixed(8);

  const handleSwap = () => {
    Alert.alert('Swap Submitted', `You are swapping ${xrpAmount} XRP for ${eurAmount} EUR.`);
  };

  return (
    <LinearGradient colors={["#000000", "#005BEA"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Swap</Text>
        <Feather name="settings" size={24} color="white" />
      </View>

      <Text style={styles.subheading}>XRP Ledger</Text>
      <Text style={styles.label}>You sell</Text>

      <View style={styles.cardRow}>
        <View style={styles.assetBox}>
          <Text style={styles.assetText}>XRP</Text>
        </View>
        <View style={styles.amountBox}>
          <TextInput
            style={styles.amountText}
            keyboardType="numeric"
            value={xrpAmount}
            onChangeText={setXrpAmount}
          />
          <Text style={styles.amountSub}>${(parseFloat(xrpAmount) * 1.855).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        {[25, 50, 75, 100].map(p => (
          <TouchableOpacity key={p} style={styles.percentButton} onPress={() => setXrpAmount(((p / 100) * 589).toFixed(2))}>
            <Text style={styles.percentText}>{p}%</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.swapIconBox}>
        <MaterialCommunityIcons name="swap-vertical" size={24} color="white" />
      </View>

      <Text style={styles.label}>You receive</Text>
      <View style={styles.cardRow}>
        <View style={styles.assetBox}>
          <Text style={styles.assetText}>EUR</Text>
        </View>
        <View style={styles.amountBox}>
          <Text style={styles.amountText}>{eurAmount}</Text>
          <Text style={styles.amountSub}>${(parseFloat(eurAmount) * 1.09).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoRate}>1 XRP = 0.2473 EUR</Text>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Price Impact</Text><Text style={styles.infoValueWarn}>-35.6524%</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Minimum Received</Text><Text style={styles.infoValue}>805.88947</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Slippage Tolerance</Text><Text style={styles.infoValue}>2%</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>AMM Pool Fees</Text><Text style={styles.infoValue}>0.116% (0.68324 XRP)</Text></View>
      </View>

      <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
        <Text style={styles.swapButtonText}>⚠ Swap (High Price Impact)</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: { fontSize: 22, color: 'white', fontWeight: '700' },
  subheading: { color: '#b084ff', marginBottom: 10 },
  label: { color: '#aaa', marginTop: 10, marginBottom: 6 },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1c1c2e',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  assetBox: { justifyContent: 'center' },
  assetText: { color: 'white', fontSize: 18 },
  amountBox: { alignItems: 'flex-end' },
  amountText: { color: 'white', fontSize: 24, fontWeight: '700' },
  amountSub: { color: '#888' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  percentButton: {
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20
  },
  percentText: { color: 'white' },
  swapIconBox: {
    alignItems: 'center',
    marginVertical: 12
  },
  infoBox: {
    backgroundColor: '#1c1c2e',
    borderRadius: 12,
    padding: 12,
    borderColor: '#FFD700',
    borderWidth: 1,
    marginVertical: 12
  },
  infoRate: {
    color: 'white',
    fontSize: 14,
    marginBottom: 6
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2
  },
  infoLabel: { color: '#ccc' },
  infoValue: { color: 'white' },
  infoValueWarn: { color: '#f5c542' },
  swapButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center'
  },
  swapButtonText: {
    fontWeight: '700',
    color: '#000'
  }
});
    