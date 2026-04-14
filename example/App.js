/**
 * Sample React Native App
 *
 * Prembly Identity KYC v2.0 Examples
 * Demonstrates both new Checker SDK and legacy API usage
 *
 * https://github.com/prembly/react-native-identity-kyc
 */

import React, { useRef, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import IdentityKyc from 'react-native-identity-kyc';

export default function App() {
  const kycRef = useRef(null);
  const [result, setResult] = useState(null);

  // Replace with your actual credentials from https://dashboard.prembly.com
  const CONFIG_ID = 'd93f22bd-7b3f-4563-ae9a-fcafd1ac858e';
  const WIDGET_KEY = 'wdgt_5d47ed6878d94cbc90ba37ac472cbce4';

  const handleComplete = (data) => {
    console.log('✅ Verification completed:', data);
    setResult(data);
    Alert.alert('Success', 'Verification completed successfully!');
  };

  const handleError = (data) => {
    console.error('❌ Error:', data);
    Alert.alert('Error', data.message || 'An error occurred');
  };

  const handleClose = (data) => {
    console.log('🚪 Widget closed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Prembly Identity KYC</Text>
        <Text style={styles.subtitle}>React Native SDK v2.0 Examples</Text>

        {/* Result Display */}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Last Verification Result:</Text>
            <Text style={styles.resultText}>
              {JSON.stringify(result, null, 2)}
            </Text>
          </View>
        )}

        {/* Example 1: New Checker SDK - Basic */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>1. New Checker SDK ⭐</Text>
          <Text style={styles.exampleDescription}>
            Using configId and widgetKey (recommended)
          </Text>
          <IdentityKyc
            configId={CONFIG_ID}
            widgetKey={WIDGET_KEY}
            onComplete={handleComplete}
            onError={handleError}
            onClose={handleClose}
            buttonText="Start Verification (New SDK)"
            loaderColor="#6c5ce7"
          />
        </View>

        {/* Example 2: With Metadata */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>2. With Metadata</Text>
          <Text style={styles.exampleDescription}>
            Pass custom data to verification flow
          </Text>
          <IdentityKyc
            configId={CONFIG_ID}
            widgetKey={WIDGET_KEY}
            metadata={{
              user_id: 'demo_user_12345',
              source: 'mobile_app',
              platform: 'react_native',
              version: '2.0.0',
            }}
            onComplete={handleComplete}
            onError={handleError}
            buttonText="Verify with Metadata"
            btnStyles={styles.metadataBtn}
            textStyles={styles.buttonText}
          />
        </View>

        {/* Example 3: Custom Button */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>3. Custom Button</Text>
          <Text style={styles.exampleDescription}>
            Fully customized button design
          </Text>
          <IdentityKyc
            configId={CONFIG_ID}
            widgetKey={WIDGET_KEY}
            onComplete={handleComplete}
            onError={handleError}
            customButton={(openWidget) => (
              <TouchableOpacity onPress={openWidget} style={styles.customBtn}>
                <Text style={styles.customBtnText}>🔐 Custom Verification</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Example 4: Programmatic Control */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>4. Programmatic Control</Text>
          <Text style={styles.exampleDescription}>
            Control widget using ref methods
          </Text>
          <IdentityKyc
            ref={kycRef}
            configId={CONFIG_ID}
            widgetKey={WIDGET_KEY}
            showDefaultButton={false}
            onComplete={handleComplete}
            onError={handleError}
            onClose={handleClose}
          />
          <View style={styles.buttonRow}>
            <Button
              title="Open Widget"
              onPress={() => kycRef.current?.open()}
              color="#3498db"
            />
            <View style={{ width: 10 }} />
            <Button
              title="Close Widget"
              onPress={() => kycRef.current?.close()}
              color="#e74c3c"
            />
          </View>
        </View>

        {/* Example 5: Legacy API (Backward Compatible) */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>5. Legacy API (v1.x)</Text>
          <Text style={styles.exampleDescription}>
            Old approach - still works!
          </Text>
          <IdentityKyc
            merchant_key="YOUR_MERCHANT_KEY"
            config_id="YOUR_CONFIG_ID"
            first_name="John"
            last_name="Doe"
            email="john.doe@example.com"
            is_test={true}
            user_ref="123456789"
            onVerified={handleComplete}
            onCancel={handleClose}
            onError={handleError}
            buttonText="Verify (Legacy API)"
            btnStyles={styles.legacyBtn}
          />
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📝 Instructions</Text>
          <Text style={styles.instructionsText}>
            1. Replace CONFIG_ID and WIDGET_KEY with your actual credentials
          </Text>
          <Text style={styles.instructionsText}>
            2. Get credentials from: https://dashboard.prembly.com
          </Text>
          <Text style={styles.instructionsText}>
            3. New Checker SDK (Examples 1-4) is recommended
          </Text>
          <Text style={styles.instructionsText}>
            4. Legacy API (Example 5) still supported for backward compatibility
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  exampleContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  exampleDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  metadataBtn: {
    backgroundColor: '#16a085',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  customBtn: {
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  customBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  legacyBtn: {
    backgroundColor: '#95a5a6',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultContainer: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#2c3e50',
  },
  instructionsContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 6,
    paddingLeft: 8,
  },
});
