# React Native Identity KYC v2.0 - Developer Guide

> Complete guide for integrating Prembly's Identity & KYC verification widget in your React Native application

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Basic Usage](#basic-usage)
6. [Advanced Usage](#advanced-usage)
7. [API Reference](#api-reference)
8. [Event Handling](#event-handling)
9. [Styling & Customization](#styling--customization)
10. [Error Handling](#error-handling)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)
13. [Migration Guide](#migration-guide)

---

## Introduction

The `react-native-identity-kyc` library (v2.0) provides a seamless way to integrate Prembly's identity verification widget into your React Native applications. This version introduces the new **Checker SDK** with session-based authentication while maintaining full backward compatibility with v1.x.

### What's New in v2.0

- ✅ **Session-based authentication** via `configId` and `widgetKey`
- ✅ **Imperative API** with `ref` methods (`open()`, `close()`)
- ✅ **Enhanced metadata** support for custom data
- ✅ **Improved callbacks** (onComplete, onLoad, onClose)
- ✅ **Auto-open** functionality
- ✅ **Backward compatible** with legacy merchant_key/config_id

---

## Getting Started

### Prerequisites

- React Native >= 0.60.0
- Node.js >= 14.0.0
- iOS 11.0+ or Android API 21+ (Android 5.0+)
- Active Prembly account with API credentials

### Get Your API Credentials

1. Visit [Prembly Dashboard](https://dashboard.prembly.com)
2. Navigate to **Widgets** section
3. Create a new widget or select an existing one
4. Copy your **Config ID** and **Widget Key**

Example:
```
Config ID: d93f22bd-7b3f-4563-ae9a-fcafd1ac858e
Widget Key: wdgt_5d47ed6878d94cbc90ba37ac472cbce4
```

---

## Installation

### Step 1: Install the Package

```bash
npm install react-native-identity-kyc react-native-webview --save
```

Or with Yarn:

```bash
yarn add react-native-identity-kyc react-native-webview
```

### Step 2: iOS Setup

```bash
cd ios && pod install && cd ..
```

### Step 3: Configure Permissions

#### For iOS (Info.plist)

Add the following permissions to your `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app requires camera access for identity verification and document scanning.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to your photo library to upload identity documents.</string>

<key>NSMicrophoneUsageDescription</key>
<string>This app may require microphone access for verification purposes.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>This app needs permission to save verification photos to your library.</string>
```

#### For Android (AndroidManifest.xml)

For **Expo projects**, add to `app.json`:

```json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "RECORD_AUDIO"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "This app requires camera access for identity verification.",
        "NSPhotoLibraryUsageDescription": "Access to photo library for document upload.",
        "NSMicrophoneUsageDescription": "Microphone access for verification.",
        "NSPhotoLibraryAddUsageDescription": "Save verification photos."
      }
    }
  }
}
```

For **bare React Native** projects, add to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
</manifest>
```

---

## Configuration

### Environment Variables (Recommended)

Create a `.env` file in your project root:

```env
PREMBLY_CONFIG_ID=d93f22bd-7b3f-4563-ae9a-fcafd1ac858e
PREMBLY_WIDGET_KEY=wdgt_5d47ed6878d94cbc90ba37ac472cbce4
```

Install `react-native-dotenv`:

```bash
npm install react-native-dotenv
```

Configure Babel (`babel.config.js`):

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }]
  ]
};
```

---

## Basic Usage

### Example 1: Simple Implementation with Default Button

```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import IdentityKyc from 'react-native-identity-kyc';

export default function App() {
  const handleComplete = (data) => {
    console.log('✅ Verification completed:', data);
    // Process verification result
    // Navigate to success screen, update user status, etc.
  };

  const handleError = (data) => {
    console.error('❌ Error:', data);
    // Show error message to user
  };

  return (
    <View style={styles.container}>
      <IdentityKyc
        configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
        widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
        onComplete={handleComplete}
        onError={handleError}
        buttonText="Verify My Identity"
        showDefaultButton={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
```

### Example 2: With User Metadata

Pass user information for pre-filling forms:

```javascript
<IdentityKyc
  configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
  widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
  metadata={{
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    user_id: 'user_12345',
    phone: '+1234567890',
    source: 'mobile_app',
    custom_field: 'any_value',
  }}
  onComplete={(data) => console.log(data)}
  onError={(data) => console.error(data)}
/>
```

### Example 3: TypeScript Implementation

```typescript
import React, { useRef } from 'react';
import { View } from 'react-native';
import IdentityKyc from 'react-native-identity-kyc';

interface VerificationResult {
  status: string;
  data?: any;
  message?: string;
}

interface IdentityKycRef {
  open: () => void;
  close: () => void;
}

export default function App() {
  const kycRef = useRef<IdentityKycRef>(null);

  const handleComplete = (data: VerificationResult) => {
    console.log('Verification completed:', data);
  };

  return (
    <View>
      <IdentityKyc
        ref={kycRef}
        configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
        widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
        onComplete={handleComplete}
        showDefaultButton={true}
      />
    </View>
  );
}
```

---

## Advanced Usage

### 1. Programmatic Control with Refs

Control the widget programmatically using refs:

```javascript
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import IdentityKyc from 'react-native-identity-kyc';

export default function App() {
  const kycRef = useRef(null);

  const openVerification = () => {
    kycRef.current?.open();
  };

  const closeVerification = () => {
    kycRef.current?.close();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Start Verification" onPress={openVerification} />
      <Button title="Cancel Verification" onPress={closeVerification} />
      
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

### 2. Custom Button Implementation

Create your own styled button:

```javascript
<IdentityKyc
  configId="your-config-id"
  widgetKey="your-widget-key"
  customButton={(openWidget) => (
    <TouchableOpacity 
      onPress={openWidget} 
      style={{
        backgroundColor: '#3498db',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
        🔐 Verify Identity
      </Text>
    </TouchableOpacity>
  )}
  onComplete={(data) => console.log(data)}
/>
```

### 3. Auto-Open Widget on Screen Load

Automatically open the widget when component mounts:

```javascript
<IdentityKyc
  configId="your-config-id"
  widgetKey="your-widget-key"
  autoOpen={true}
  showDefaultButton={false}
  onComplete={(data) => {
    console.log('Verification completed');
    // Navigate to next screen
    navigation.navigate('Success');
  }}
/>
```

### 4. Complete Example with State Management

```javascript
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import IdentityKyc from 'react-native-identity-kyc';

export default function VerificationScreen({ route, navigation }) {
  const kycRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  const { userId, userEmail } = route.params;

  const handleComplete = (data) => {
    console.log('✅ Verification completed:', data);
    setIsProcessing(true);
    
    // Send result to your backend
    fetch('https://your-api.com/verification/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        verificationData: data,
      }),
    })
      .then(response => response.json())
      .then(result => {
        setVerificationResult(result);
        setIsProcessing(false);
        Alert.alert('Success', 'Identity verified successfully!');
        navigation.navigate('Dashboard');
      })
      .catch(error => {
        setIsProcessing(false);
        Alert.alert('Error', 'Failed to process verification');
      });
  };

  const handleError = (data) => {
    console.error('❌ Error:', data);
    Alert.alert(
      'Verification Error',
      data.message || 'An error occurred during verification'
    );
  };

  const handleClose = () => {
    console.log('🚪 Widget closed');
    Alert.alert(
      'Verification Cancelled',
      'Do you want to try again?',
      [
        { text: 'No', onPress: () => navigation.goBack() },
        { text: 'Yes', onPress: () => kycRef.current?.open() },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Identity Verification</Text>
      <Text style={styles.subtitle}>
        Please complete the verification process
      </Text>

      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text>Processing verification...</Text>
        </View>
      )}

      <IdentityKyc
        ref={kycRef}
        configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
        widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
        metadata={{
          user_id: userId,
          email: userEmail,
          source: 'mobile_app',
        }}
        onComplete={handleComplete}
        onError={handleError}
        onClose={handleClose}
        onLoad={() => console.log('Widget loaded')}
        buttonText="Start Verification Process"
        loaderColor="#3498db"
        showDefaultButton={true}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ️ You'll need to provide a valid ID document and take a selfie
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
  },
  processingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    color: '#2c3e50',
    fontSize: 14,
  },
});
```

---

## API Reference

### Props

#### New Checker SDK Props (v2.0)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `configId` | `string` | Yes* | - | Your Prembly widget configuration ID |
| `widgetKey` | `string` | Yes* | - | Your widget authentication key from Prembly dashboard |
| `metadata` | `object` | No | `{}` | Additional user data and custom fields |
| `onComplete` | `function` | No | - | Callback when verification completes successfully |
| `onLoad` | `function` | No | - | Callback when widget finishes loading |
| `onClose` | `function` | No | - | Callback when widget is closed by user |

#### Common Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onError` | `function` | No | - | Callback when an error occurs |
| `onEvent` | `function` | No | - | Callback for custom widget events |
| `buttonText` | `string` | No | `"Verify My Identity"` | Text displayed on default button |
| `loaderColor` | `string` | No | `"purple"` | Color of the loading spinner |
| `loadingText` | `string` | No | `"Loading Prembly Widget..."` | Text shown while loading |
| `showDefaultButton` | `boolean` | No | `true` | Show or hide the default button |
| `showCloseButton` | `boolean` | No | `true` | Show or hide close button in modal |
| `autoOpen` | `boolean` | No | `false` | Automatically open widget on mount |
| `animationType` | `'slide' \| 'fade' \| 'none'` | No | `'slide'` | Modal animation type |
| `customButton` | `function` | No | - | Render custom button component |
| `btnStyles` | `object` | No | - | Custom styles for default button |
| `textStyles` | `object` | No | - | Custom styles for button text |
| `containerStyle` | `object` | No | - | Custom styles for container |

#### Legacy Props (Backward Compatible)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `merchant_key` | `string` | Yes* | - | Your merchant key (legacy API) |
| `config_id` | `string` | Yes* | - | Configuration ID (legacy API) |
| `first_name` | `string` | No | - | User's first name |
| `last_name` | `string` | No | - | User's last name |
| `email` | `string` | No | - | User's email address |
| `user_ref` | `string` | No | - | User reference ID |
| `is_test` | `boolean` | No | `false` | Enable test mode |
| `onVerified` | `function` | No | - | Callback on successful verification (legacy) |
| `onCancel` | `function` | No | - | Callback when user cancels (legacy) |

**Note:** Use either New API (`configId` + `widgetKey`) OR Legacy API (`merchant_key` + `config_id`), not both.

### Ref Methods

Expose imperative methods via ref:

```javascript
const kycRef = useRef(null);

// Open widget programmatically
kycRef.current?.open();

// Close widget programmatically
kycRef.current?.close();
```

### Callback Data Structures

#### onComplete Callback

```javascript
{
  status: "success",
  data: {
    verification_id: "ver_123456789",
    user_details: {
      first_name: "John",
      last_name: "Doe",
      // ... other user data
    },
    document_details: {
      type: "passport",
      number: "N12345678",
      // ... document info
    },
    verification_status: "approved",
    timestamp: "2024-04-14T10:00:00Z"
  }
}
```

#### onError Callback

```javascript
{
  status: "error",
  message: "Failed to initiate session",
  code: "SESSION_ERROR",
  details: { /* additional error info */ }
}
```

#### onClose Callback

```javascript
{
  status: "closed",
  reason: "user_cancelled"
}
```

---

## Event Handling

### Handling Verification Success

```javascript
const handleComplete = (data) => {
  const { verification_id, verification_status } = data.data;
  
  if (verification_status === 'approved') {
    // Update user status in your database
    updateUserVerificationStatus(verification_id);
    
    // Navigate to success screen
    navigation.navigate('VerificationSuccess');
  } else if (verification_status === 'pending') {
    // Show pending message
    Alert.alert('Pending', 'Verification is being reviewed');
  }
};
```

### Handling Errors

```javascript
const handleError = (data) => {
  // Log error for debugging
  console.error('Verification error:', data);
  
  // Show user-friendly message
  const errorMessages = {
    'SESSION_ERROR': 'Failed to start verification. Please try again.',
    'NETWORK_ERROR': 'Network connection issue. Check your internet.',
    'CAMERA_ERROR': 'Camera access denied. Please enable camera permissions.',
  };
  
  const message = errorMessages[data.code] || data.message || 'An error occurred';
  Alert.alert('Error', message);
  
  // Send error to analytics/monitoring service
  analytics.logError('kyc_verification_error', data);
};
```

### Handling Widget Closure

```javascript
const handleClose = () => {
  Alert.alert(
    'Verification Incomplete',
    'You closed the verification widget. Would you like to try again?',
    [
      {
        text: 'Cancel',
        onPress: () => navigation.goBack(),
        style: 'cancel',
      },
      {
        text: 'Try Again',
        onPress: () => kycRef.current?.open(),
      },
    ]
  );
};
```

---

## Styling & Customization

### Custom Button Styles

```javascript
<IdentityKyc
  configId="your-config-id"
  widgetKey="your-widget-key"
  btnStyles={{
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }}
  textStyles={{
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }}
/>
```

### Custom Loader Color

```javascript
<IdentityKyc
  configId="your-config-id"
  widgetKey="your-widget-key"
  loaderColor="#e74c3c"
  loadingText="Initializing verification..."
/>
```

### Modal Animation

```javascript
<IdentityKyc
  configId="your-config-id"
  widgetKey="your-widget-key"
  animationType="fade" // 'slide', 'fade', or 'none'
/>
```

---

## Error Handling

### Common Errors and Solutions

#### 1. Session Initialization Failed

**Error:** `Failed to initiate session`

**Solutions:**
- Verify your `configId` and `widgetKey` are correct
- Check internet connection
- Ensure Prembly API is accessible

```javascript
const handleError = (data) => {
  if (data.message.includes('session')) {
    Alert.alert(
      'Connection Error',
      'Unable to start verification. Please check your internet connection.',
      [
        { text: 'Retry', onPress: () => kycRef.current?.open() },
        { text: 'Cancel' }
      ]
    );
  }
};
```

#### 2. Camera Permission Denied

**Error:** Camera not accessible

**Solution:** Request permissions before opening widget

```javascript
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    return result === RESULTS.GRANTED;
  }
};

const startVerification = async () => {
  const hasPermission = await requestCameraPermission();
  if (hasPermission) {
    kycRef.current?.open();
  } else {
    Alert.alert('Permission Denied', 'Camera access is required for verification');
  }
};
```

#### 3. Widget Not Loading

**Error:** Widget stuck on loading screen

**Solutions:**
- Check WebView is installed: `npm ls react-native-webview`
- Clear cache and reinstall
- Check device internet connection

```javascript
<IdentityKyc
  configId="your-config-id"
  widgetKey="your-widget-key"
  onLoad={() => console.log('Widget loaded successfully')}
  onError={(data) => {
    console.error('Load error:', data);
    // Retry logic
  }}
/>
```

---

## Testing

### Testing in Development

```javascript
// Use test credentials provided by Prembly
const TEST_CONFIG_ID = 'test-config-id';
const TEST_WIDGET_KEY = 'test-widget-key';

<IdentityKyc
  configId={__DEV__ ? TEST_CONFIG_ID : PROD_CONFIG_ID}
  widgetKey={__DEV__ ? TEST_WIDGET_KEY : PROD_WIDGET_KEY}
  metadata={{ is_test: __DEV__ }}
  onComplete={(data) => {
    console.log('Test verification:', data);
  }}
/>
```

### Mock Testing

```javascript
// Create a mock for unit tests
jest.mock('react-native-identity-kyc', () => {
  return {
    __esModule: true,
    default: ({ onComplete }) => {
      const MockComponent = () => {
        return (
          <View testID="mock-kyc">
            <Button
              title="Complete Mock Verification"
              onPress={() => onComplete({
                status: 'success',
                data: { verification_id: 'test_123' }
              })}
            />
          </View>
        );
      };
      return <MockComponent />;
    },
  };
});
```

---

## Troubleshooting

### Issue: "initializing camera" stuck indefinitely

**Cause:** Native permissions not applied after changes

**Solution:**
```bash
# For Expo
npx expo prebuild --clean
npx expo run:android  # or run:ios

# For bare React Native
cd ios && pod install && cd ..
npx react-native run-ios  # or run-android
```

### Issue: Module not found error

**Solution:**
```bash
# Clear cache
npm start -- --reset-cache

# Reinstall
rm -rf node_modules
npm install
cd ios && pod install && cd ..
```

### Issue: WebView not displaying

**Solution:**
```bash
# Ensure WebView is installed
npm install react-native-webview
cd ios && pod install && cd ..
npx react-native run-ios
```

### Issue: Android build fails with Gradle error

**Solution:**
Create `android/local.properties`:
```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

---

## Migration Guide

### From v1.x to v2.0

#### Option 1: Migrate to New API (Recommended)

**Before (v1.x):**
```javascript
<IdentityKyc
  merchant_key="YOUR_MERCHANT_KEY"
  config_id="YOUR_CONFIG_ID"
  first_name="John"
  last_name="Doe"
  email="john@example.com"
  user_ref="user_123"
  onVerified={(data) => console.log(data)}
  onCancel={() => console.log('Cancelled')}
  onError={(error) => console.error(error)}
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
    email: "john@example.com",
    user_ref: "user_123"
  }}
  onComplete={(data) => console.log(data)}
  onClose={() => console.log('Closed')}
  onError={(error) => console.error(error)}
/>
```

#### Option 2: Keep Using Legacy API

**No changes needed!** v2.0 is fully backward compatible:

```javascript
// This v1.x code works as-is in v2.0
<IdentityKyc
  merchant_key="YOUR_MERCHANT_KEY"
  config_id="YOUR_CONFIG_ID"
  first_name="John"
  onVerified={(data) => console.log(data)}
/>
```

### Callback Migration

| v1.x | v2.0 | Description |
|------|------|-------------|
| `onVerified` | `onComplete` | Verification successful |
| `onCancel` | `onClose` | User closed widget |
| `onError` | `onError` | Error occurred (same) |
| - | `onLoad` | Widget loaded (new) |

---

## Best Practices

### 1. Handle All Callbacks

```javascript
<IdentityKyc
  configId="your-config-id"
  widgetKey="your-widget-key"
  onComplete={handleComplete}
  onError={handleError}
  onClose={handleClose}
  onLoad={handleLoad}
/>
```

### 2. Use Environment Variables

```javascript
import { PREMBLY_CONFIG_ID, PREMBLY_WIDGET_KEY } from '@env';

<IdentityKyc
  configId={PREMBLY_CONFIG_ID}
  widgetKey={PREMBLY_WIDGET_KEY}
/>
```

### 3. Implement Loading States

```javascript
const [isLoading, setIsLoading] = useState(false);

<IdentityKyc
  onLoad={() => setIsLoading(false)}
  onComplete={() => setIsLoading(false)}
/>
```

### 4. Log Events for Debugging

```javascript
<IdentityKyc
  onLoad={() => console.log('[KYC] Widget loaded')}
  onComplete={(data) => console.log('[KYC] Completed:', data)}
  onError={(error) => console.error('[KYC] Error:', error)}
  onClose={() => console.log('[KYC] Closed')}
/>
```

### 5. Store Verification Results

```javascript
const handleComplete = async (data) => {
  try {
    // Store in AsyncStorage for offline access
    await AsyncStorage.setItem('verification_result', JSON.stringify(data));
    
    // Send to backend
    await fetch('https://api.yourapp.com/verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Update app state
    dispatch(setVerificationStatus('verified'));
  } catch (error) {
    console.error('Failed to process verification:', error);
  }
};
```

---

## Support & Resources

### Documentation
- 📚 [Prembly API Docs](https://docs.prembly.com)
- 📖 [React Native Docs](https://reactnative.dev)

### Get Help
- 💬 [Prembly Support](https://support.prembly.com)
- 📧 Email: support@prembly.com
- 🐛 [GitHub Issues](https://github.com/prembly/react-native-identity-kyc/issues)

### Community
- 💼 [LinkedIn](https://linkedin.com/company/prembly)
- 🐦 [Twitter](https://twitter.com/prembly)

---

## License

MIT License - see LICENSE file for details

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

**Last Updated:** April 14, 2026  
**Version:** 2.0.0  
**Author:** Prembly Engineering Team
