import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import TidyposTerminal from 'react-native-tidypos-terminal';

import { CREDENTIALS } from './constants';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [amount, changeAmount] = useState('');

  const charge = () => {
    console.log('Charging ' + amount + ' cents');
    const params = {
      partialAuthorizationPolicy: 'N',
      receiptMode: 'P',
      requestType: 'sale',
      transactionIndustryType: 'RS',
      holderName: 'John Doe',
      transactionInternalCode: 'P',
      transactionOriginCode: '',
      memo: 'xyz',
      customerAccountCode: '2001',
      customerAccountInternalCode: 'abc',
      userCode: 'P',
      taxAmount: '100',
      tipRecipientCode: '2001',
      transactionCode: '0000000001', // (mandatory) unique reference number from POS system to prevent duplicate transactions
      amount,
    };

    setLoading(true);

    TidyposTerminal.startPayment(CREDENTIALS, params)
      .then((data) => {
        console.log('TidyposTerminal.startPayment() success', data);
        setLoading(false);
        alert(JSON.stringify(data));
      })
      .catch((err) => {
        console.log('TidyposTerminal.startPayment() error', err);
        setLoading(false);
        alert(JSON.stringify(err));
      });
  };

  return (
    <View>
      {loading ? (
        <View style={styles.loaderStyle}>
          <ActivityIndicator
            size={'large'}
            color={'#8558C1'} // DARK_GREEN
          />
        </View>
      ) : (
        <View>
          <Text style={styles.headerText}>tidypos Payment</Text>
          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={changeAmount}
              placeholder="Enter Amount"
            />
            <TouchableOpacity style={styles.chargeBtn} onPress={charge}>
              <Text style={styles.chargeBtnText}>Charge</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  loaderStyle: {
    margin: '50%',
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Arial-BoldMT',
    color: '#111111', // BLACK
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    flex: 7,
    height: 40,
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 10,
    padding: 10,
  },
  chargeBtn: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: '#6020B2', // DARK_PURPLE
    height: 40,
    borderRadius: 6,
  },
  chargeBtnText: {
    color: '#ffffff', // WHITE
    fontFamily: 'Arial-BoldMT',
    fontSize: 17,
  },
});

export default App;
