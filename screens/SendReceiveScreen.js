import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';

export default function SendReceiveScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState('send');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert('Scanned Address', data);
    setManualInput(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{mode === 'send' ? 'Send XRP' : 'Receive XRP'}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Entypo name="info" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleWrapper}>
        <TouchableOpacity style={[styles.toggleButton, mode === 'receive' && styles.toggleActive]} onPress={() => setMode('receive')}>
          <Ionicons name="qr-code" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, mode === 'send' && styles.toggleActive]} onPress={() => setMode('send')}>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {mode === 'send' ? (
        <View>
          {hasPermission === null ? (
            <Text style={{ color: 'white' }}>Requesting camera permission...</Text>
          ) : hasPermission === false ? (
            <Text style={{ color: 'white' }}>No access to camera</Text>
          ) : (
            <Camera
              ref={cameraRef}
              style={styles.cameraBox}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
            />
          )}

          {scanned && (
            <TouchableOpacity onPress={() => setScanned(false)} style={styles.scanAgainBtn}>
              <Text style={styles.copyText}>Scan Again</Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            placeholder="Or enter wallet address manually"
            placeholderTextColor="#999"
            value={manualInput}
            onChangeText={setManualInput}
          />
        </View>
      ) : (
        <View style={styles.receiveBox}>
          <Image
            source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?data=rEAKseZ7yNgaDuxH74PkqB12cVWohpi7R6' }}
            style={styles.qr}
          />
          <Text style={styles.walletAddress}>rEAKseZ7yNgaDuxH74PkqB12cVWohpi7R6</Text>
          <View style={styles.memoTag}><Text style={styles.memoText}>Memo: 2533149819</Text></View>
          <Text style={styles.warningText}>
            A memo is required to receive XRP on this address. If the sender doesn't include a memo, you may not receive your crypto. Sending NFTs, other crypto, or using other networks can lead to a loss of your crypto.
          </Text>
          <TouchableOpacity style={styles.copyButton}><Text style={styles.copyText}>Copy address</Text></TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}><Text style={styles.copyText}>Share address</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10
  },
  iconButton: {
    padding: 6
  },
  toggleWrapper: {
    flexDirection: 'row', backgroundColor: '#1c1c1e', borderRadius: 30, marginVertical: 12, alignSelf: 'center'
  },
  toggleButton: {
    padding: 10
  },
  toggleActive: {
    backgroundColor: '#333', borderRadius: 30
  },
  title: {
    textAlign: 'center', color: 'white', fontSize: 20, fontWeight: '600'
  },
  cameraBox: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20
  },
  scanAgainBtn: {
    backgroundColor: 'white', padding: 10, alignSelf: 'center', borderRadius: 10, marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    color: 'white',
    padding: 12,
    marginTop: 10
  },
  receiveBox: {
    alignItems: 'center'
  },
  qr: {
    width: 200, height: 200, marginBottom: 16
  },
  walletAddress: {
    color: 'white', fontSize: 14, marginBottom: 8
  },
  memoTag: {
    backgroundColor: 'yellow', padding: 4, borderRadius: 8, marginBottom: 10
  },
  memoText: {
    color: '#000', fontWeight: '600'
  },
  warningText: {
    color: '#aaa', fontSize: 12, marginBottom: 20, textAlign: 'center'
  },
  copyButton: {
    backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, marginBottom: 10
  },
  shareButton: {
    borderWidth: 1, borderColor: 'white', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30
  },
  copyText: {
    fontWeight: '600'
  }
});
