// Dashboard.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Platform, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const transactions = [
  { id: '1', name: 'Aaron Jackson', date: 'Sunday', amount: '$65.00', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '2', name: 'Zuri James', date: '4/9/25', amount: '$275.00', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Calvin Miller', date: '4/9/25', amount: '$2,400.00', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', name: 'Cherish Blackard', date: '3/17/25', amount: '$190.00', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'Josh Cotton', date: '3/15/25', amount: '$200.00', image: 'https://randomuser.me/api/portraits/women/5.jpg' },
  { id: '6', name: 'Marty Monroe', date: '3/14/25', amount: '$420.00', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

export default function Dashboard() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.card}>
          <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={styles.title}>DualPay</Text>
          <View style={styles.balanceBox}>
            <Text style={styles.totalLabel}>Total Balance</Text>
            <Text style={styles.totalBalance}>$31,092.87</Text>
            <Text style={styles.xrpInfo}>3,767.678 XRP = $15,305.99</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.action}>
            <Ionicons name="arrow-down" size={24} color="white" />
            <Text style={styles.actionLabel}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => navigation.navigate('SendReceive')}>
            <Ionicons name="paper-plane" size={24} color="white" />
            <Text style={styles.actionLabel}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => navigation.navigate('Swap')}>
            <Ionicons name="swap-horizontal" size={24} color="white" />
            <Text style={styles.actionLabel}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action}>
            <Ionicons name="qr-code" size={24} color="white" />
            <Text style={styles.actionLabel}>Request</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Latest Transactions</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionRow}>
              <Image
                source={{ uri: item.image }}
                style={styles.avatar}
              />
              <View style={styles.transactionDetails}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.date}>Sent {item.date}</Text>
              </View>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
          )}
        />

        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton}><Ionicons name="home" size={24} color="dodgerblue" /><Text style={styles.navLabel}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navButton}><Ionicons name="wallet" size={24} color="white" /><Text style={styles.navLabel}>My Assets</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navButton}><Ionicons name="cash" size={24} color="white" /><Text style={styles.navLabel}>Earn</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navButton}><Ionicons name="menu" size={24} color="white" /><Text style={styles.navLabel}>More</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  card: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    height: 220,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative'
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    zIndex: -1
  },
  title: { color: 'white', fontSize: 25, fontWeight: '700', position: 'absolute', top: 20, left: 20 },
  totalLabel: { color: '#ccc', fontSize: 17 },
  totalBalance: { color: 'white', fontSize: 32, fontWeight: '800', marginTop: 4 },
  xrpInfo: { color: '#aaa', fontSize: 17, marginTop: 2 },
  balanceBox: {
    position: 'absolute',
    left: 20,
    bottom: 20
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16
  },
  action: { alignItems: 'center' },
  actionLabel: { color: 'white', marginTop: 5 },
  transactionsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10
  },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  viewAll: { color: 'dodgerblue' },
  transactionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1a1a1a', padding: 12, borderRadius: 10, marginBottom: 10
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  transactionDetails: { flex: 1 },
  name: { color: 'white', fontWeight: '600', fontSize: 16 },
  date: { color: '#aaa', fontSize: 13 },
  amount: { color: 'white', fontSize: 16, fontWeight: '600' },
  navBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 12, backgroundColor: '#111', borderTopWidth: 1, borderColor: '#222'
  },
  navButton: { alignItems: 'center' },
  navLabel: { color: 'white', fontSize: 12, marginTop: 4 }
});
