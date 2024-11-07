# react-native-identity-kyc

## Getting started

`$ npm install react-native-identity-kyc --save`

### Mostly automatic installation

`$ react-native link react-native-identity-kyc`




## Requirement
# Android

// Add the following permission to your android "AndroidManifest.xml" file
```xml
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <uses-permission android:name="android.permission.VIDEO_CAPTURE" />
```

# IOS

// Add the following permission to your android "info.plist" file
```plist
    <key>NSPhotoLibraryUsageDescription</key>
    <string>App needs access to photo lib for profile images</string>
    <key>NSCameraUsageDescription</key>
    <string>To capture profile photo please grant camera access</string>
```



## Usage
```javascript
import IdentityKyc from 'react-native-identity-kyc';

// TODO: What to do with the module?
<IdentityKyc
        loaderColor={'red'}
        buttonText={'Verify'}
        showDefaultButton={true}
        merchant_key="PREMBLY-PRODUCT SDK KEY (PUBLIC KEY)" //text key
        first_name="kayode"
        last_name="olayiwola"
        email="olayiuwolakayode07@gmail.com"
        is_test={false}
        user_ref="123456789012345"
        onCancel={data => {
          console.log(data);
        }}
        onVerified:{data => {
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
        merchant_key="PREMBLY-PRODUCT SDK KEY (PUBLIC KEY)" //text key
        first_name="kayode"
        last_name="olayiwola"
        email="olayiuwolakayode07@gmail.com"
        is_test={false}
        user_ref="123456789012345"
        onCancel={data => {
          console.log(data);
        }}
        onVerified:{data => {
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
