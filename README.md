# react-native-identity-kyc

React Native wrapper for Prembly Identity & KYC verification widget supporting both the new **Checker SDK** and legacy implementations.

## 🚀 Version 2.0 - Now with Checker SDK Support!

This library now supports the new Prembly Checker SDK flow with `init()` and `open()` pattern, while maintaining full backward compatibility with v1.x.

## Features

- ✅ **New Checker SDK** integration with `configId` and `widgetKey`
- ✅ **Backward compatible** with legacy merchant_key/config_id approach
- ✅ **iOS and Android** support
- ✅ **Imperative API** with ref methods (`open()`, `close()`)
- ✅ **Auto-open** support
- ✅ **Custom buttons** and styling
- ✅ **Metadata** support
- ✅ **Multiple callbacks**: onComplete, onError, onClose, onLoad
- ✅ **Loading states** with customizable loaders

## Installation

```bash
npm install react-native-identity-kyc react-native-webview --save
```

or

```bash
yarn add react-native-identity-kyc react-native-webview
```

### iOS Setup

```bash
cd ios && pod install
```

## Permissions Required

### Android

Add to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.VIDEO_CAPTURE" />
```

### iOS

Add to your `Info.plist`:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>App needs access to photo library for profile images</string>
<key>NSCameraUsageDescription</key>
<string>To capture profile photo please grant camera access</string>
```

## Usage

### 🆕 New Checker SDK Approach (Recommended)

Using the new Checker SDK with `configId` and `widgetKey`:

```javascript
import React from 'react';
import { View } from 'react-native';
import IdentityKyc from 'react-native-identity-kyc';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <IdentityKyc
        configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
        widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
        onComplete={(data) => {
          console.log('Verification completed:', data);
        }}
        onError={(data) => {
          console.error('Verification error:', data);
        }}
        onClose={(data) => {
          console.log('Widget closed:', data);
        }}
        buttonText="Start Verification"
        showDefaultButton={true}
      />
    </View>
  );
}
```

### With Metadata

```javascript
<IdentityKyc
  configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
  widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
  metadata={{
    user_id: 'user_12345',
    source: 'mobile_app',
    custom_field: 'value',
  }}
  onComplete={(data) => console.log(data)}
  onError={(data) => console.error(data)}
/>
```

### Programmatic Control with Ref

```javascript
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import IdentityKyc from 'react-native-identity-kyc';

export default function App() {
  const kycRef = useRef(null);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open KYC" onPress={() => kycRef.current?.open()} />
      <Button title="Close KYC" onPress={() => kycRef.current?.close()} />
      
      <IdentityKyc
        ref={kycRef}
        configId="your-config-id"
        widgetKey="your-widget-key"
        showDefaultButton={false}
        onComplete={(data) => console.log(data)}
      />
    </View>
  );
}
```

### Auto-Open Widget

```javascript
<IdentityKyc
  configId="your-config-id"
  widgetKey="your-widget-key"
  autoOpen={true}
  showDefaultButton={false}
  onComplete={(data) => console.log(data)}
/>
```

### Custom Button

```javascript
<IdentityKyc
  configId="your-config-id"
  widgetKey="your-widget-key"
  customButton={(openWidget) => (
    <TouchableOpacity onPress={openWidget} style={styles.customBtn}>
      <Text style={styles.customText}>🔐 Verify Identity</Text>
    </TouchableOpacity>
  )}
  onComplete={(data) => console.log(data)}
/>
```

---

### 🔄 Legacy Approach (Backward Compatible)

Still works with the old merchant_key and config_id approach:

```javascript
<IdentityKyc
  loaderColor="red"
  buttonText="Verify"
  showDefaultButton={true}
  merchant_key="YOUR_MERCHANT_KEY"
  first_name="John"
  last_name="Doe"
  email="john.doe@example.com"
  is_test={false}
  config_id="YOUR_CONFIG_ID"
  user_ref="123456789012345"
  onVerified={(data) => {
    console.log(data);
  }}
  onCancel={(data) => {
    console.log(data);
  }}
  onError={(data) => {
    console.log(data);
  }}
/>
```

## API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| **New Checker SDK Props** |
| `configId` | string | Yes* | - | Your Prembly configuration ID (new API) |
| `widgetKey` | string | Yes* | - | Your widget key from Prembly dashboard (new API) |
| `metadata` | object | No | {} | Additional metadata for verification |
| `onComplete` | function | No | - | Callback when verification completes (new API) |
| `onLoad` | function | No | - | Callback when widget loads |
| `onClose` | function | No | - | Callback when widget closes |
| **Legacy Props (Backward Compatible)** |
| `merchant_key` | string | Yes* | - | Your merchant key (legacy) |
| `config_id` | string | Yes* | - | Configuration ID (legacy) |
| `first_name` | string | No | - | User's first name (legacy) |
| `last_name` | string | No | - | User's last name (legacy) |
| `email` | string | No | - | User's email (legacy) |
| `user_ref` | string | No | - | User reference ID (legacy) |
| `is_test` | boolean | No | false | Test mode flag (legacy) |
| `onVerified` | function | No | - | Callback on success (legacy) |
| `onCancel` | function | No | - | Callback on cancel (legacy) |
| **Common Props** |
| `onError` | function | No | - | Callback when error occurs |
| `onEvent` | function | No | - | Callback for custom events |
| `buttonText` | string | No | "Verify My Identity" | Text for default button |
| `loaderColor` | string | No | "purple" | Color of loading spinner |
| `loadingText` | string | No | "Loading Prembly Widget..." | Loading text |
| `showDefaultButton` | boolean | No | true | Show/hide default button |
| `showCloseButton` | boolean | No | true | Show/hide close button in modal |
| `autoOpen` | boolean | No | false | Auto-open widget on mount |
| `animationType` | string | No | "slide" | Modal animation ("slide", "fade", "none") |
| `customButton` | function | No | - | Custom button component |
| `btnStyles` | object | No | - | Custom button styles |
| `textStyles` | object | No | - | Custom text styles |
| `containerStyle` | object | No | - | Container styles |

*Either use new API (`configId` + `widgetKey`) OR legacy API (`merchant_key` + `config_id`)

### Ref Methods

| Method | Description |
|--------|-------------|
| `open()` | Opens the widget modal programmatically |
| `close()` | Closes the widget modal programmatically |

### Callback Data Structures

#### onComplete / onVerified

```javascript
{
  status: "success",
  data: {
    // Verification result data
  }
}
```

#### onError

```javascript
{
  status: "error",
  message: "Error message"
}
```

#### onClose / onCancel

```javascript
{
  status: "closed"
}
```

## Complete Example

```javascript
import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import IdentityKyc from 'react-native-identity-kyc';

export default function App() {
  const kycRef = useRef(null);
  const [result, setResult] = useState(null);

  return (
    <View style={styles.container}>
      {/* Programmatic Control */}
      <Button 
        title="Open Widget Manually" 
        onPress={() => kycRef.current?.open()} 
      />

      {/* KYC Widget with New Checker SDK */}
      <IdentityKyc
        ref={kycRef}
        configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
        widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
        metadata={{
          user_id: 'demo_user_123',
          source: 'mobile_app',
        }}
        onComplete={(data) => {
          console.log('✅ Verification completed:', data);
          setResult(data);
        }}
        onError={(data) => {
          console.error('❌ Error:', data);
        }}
        onClose={(data) => {
          console.log('🚪 Widget closed');
        }}
        onLoad={() => {
          console.log('📦 Widget loaded');
        }}
        buttonText="Verify My Identity"
        loaderColor="#6c5ce7"
        showDefaultButton={true}
        customButton={(openWidget) => (
          <TouchableOpacity onPress={openWidget} style={styles.verifyBtn}>
            <Text style={styles.verifyText}>🔐 Start Verification</Text>
          </TouchableOpacity>
        )}
      />

      {result && (
        <View style={styles.result}>
          <Text>Verification Result:</Text>
          <Text>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  verifyBtn: {
    backgroundColor: '#a7038b',
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  verifyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});
```

## Migration from v1.x to v2.0

### Option 1: Use New Checker SDK (Recommended)

**Before (v1.x):**
```javascript
<IdentityKyc
  merchant_key="YOUR_KEY"
  config_id="YOUR_CONFIG"
  first_name="John"
  last_name="Doe"
  email="john@example.com"
  onVerified={(data) => console.log(data)}
/>
```

**After (v2.0):**
```javascript
<IdentityKyc
  configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
  widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
  metadata={{
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com"
  }}
  onComplete={(data) => console.log(data)}
/>
```

### Option 2: No Changes Needed

Your existing v1.x code will continue to work without any changes! The library is fully backward compatible.

## Getting Credentials

### For New Checker SDK:
1. Visit [Prembly Dashboard](https://dashboard.prembly.com)
2. Create a new widget configuration
3. Copy your `configId` and `widgetKey`

### For Legacy API:
Your existing merchant keys and config IDs continue to work.

## Troubleshooting

### WebView Not Loading

Ensure `react-native-webview` is installed:
```bash
npm install react-native-webview
cd ios && pod install
```

### Android WebView Issues

Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<application>
  <uses-library android:name="org.apache.http.legacy" android:required="false"/>
</application>
```

### Widget Not Displaying

- Check that you have valid credentials
- Verify internet connection
- Check console logs for errors
- Ensure permissions are granted

## Requirements

- React Native >= 0.60.0
- react-native-webview >= 11.0.0
- iOS 11.0+
- Android API 21+ (Android 5.0+)

## Support

- 📧 Email: support@prembly.com
- 🐛 Issues: [GitHub Issues](https://github.com/prembly/react-native-identity-kyc/issues)
- 📚 Documentation: [Prembly Docs](https://docs.prembly.com)

## Changelog

### v2.0.0
- ✨ Added Checker SDK support with `configId` and `widgetKey`
- ✨ Added imperative ref API (`open()`, `close()`)
- ✨ Added metadata support
- ✨ Added `onComplete`, `onLoad`, `onClose` callbacks
- ✨ Added auto-open functionality
- ✨ Added close button in modal
- ✨ Enhanced error handling
- ✅ Full backward compatibility with v1.x

### v1.1.1
- Legacy implementation with URL-based approach

## License

MIT © Prembly

---

Made with ❤️ by [Prembly](https://prembly.com)
