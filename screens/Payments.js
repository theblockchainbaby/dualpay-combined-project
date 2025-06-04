import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Payments({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payments</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Make a Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Request a Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0f62fe',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
