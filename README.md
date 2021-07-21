# react-native-identity-kyc

## Getting started

`$ npm install react-native-identity-kyc --save`

### Mostly automatic installation

`$ react-native link react-native-identity-kyc`

## Usage
```javascript
import IdentityKyc from 'react-native-identity-kyc';

// TODO: What to do with the module?
<IdentityKyc
        loaderColor={'red'}
        buttonText={'Verify'}
        showDefaultButton={true}
        merchant_key="osdhcoshcodihso" //text key
        first_name="kayode"
        last_name="olayiwola"
        email="olayiuwolakayode07@gmail.com"
        onCancel={data => {
          console.log(data);
        }}
        onError={data => {
          console.log(data);
        }}
        />
```


## Complete Code sample
```javascript
import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import IdentityKyc from 'react-native-identity-kyc';

export default class App extends Component {
  state = {
    status: 'starting',
    message: '--',
  };

  render() {
    return (
      <IdentityKyc
        containerStyle={styles.container}
        loaderColor={'red'}
        buttonText={'Verify'}
        showDefaultButton={true}
        merchant_key="osdhcoshcodihso" //text key
        first_name="kayode"
        last_name="olayiwola"
        email="olayiuwolakayode07@gmail.com"
        onCancel={data => {
          console.log(data);
        }}
        onError={data => {
          console.log(data);
        }}
        customButton={onPress => (
          <TouchableOpacity onPress={onPress} style={styles.verifyBtn}>
            <Text style={styles.verifyText}>Verify My Identity</Text>
          </TouchableOpacity>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
 
  verifyBtn: {
    backgroundColor: '#a7038b',
    padding: 20,
    borderRadius: 20,
  },
  verifyText: {
    color: 'white',
  },
});

```