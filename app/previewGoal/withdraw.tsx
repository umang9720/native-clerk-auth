import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DepositScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleWithdraw = () => {
    // Post data to backend
    console.log({ title, amount, note });
    Alert.alert(
          'Withdraw Successful',
          `You have Withdraw £${amount} for "${title}".`,
          [
            { text: 'OK', onPress: () => console.log('Withdraw confirmed') }
          ]
        );
        
      };

  return (
   <SafeAreaView style={{flex:1}}>
     <View style={styles.container}>
      <Text style={styles.header}>New York Trip</Text>
      <Text style={styles.subheader}>£300 of £800</Text>

      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Amount Ex. £40" style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />
      <TextInput placeholder="Note" style={styles.input} value={note} onChangeText={setNote} />

      <Text>Account: ****8435</Text>

<TouchableOpacity style={[styles.depositBtn, { backgroundColor: 'red' }]} onPress={handleWithdraw}>
  <Text style={styles.depositText}>Withdraw</Text>
</TouchableOpacity>

    </View>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold' },
  subheader: { color: 'gray', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginVertical: 6 },
  depositBtn: { backgroundColor: 'green', padding: 16, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  depositText: { color: 'white', fontWeight: 'bold' },
});
