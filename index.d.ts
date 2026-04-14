import { Component } from 'react';
import { ViewStyle, TextStyle, StyleProp } from 'react-native';

// Metadata for new Checker SDK
export interface IdentityKycMetadata {
  [key: string]: any;
}

// Result data structure
export interface IdentityKycResult {
  status: 'success' | 'error' | 'closed';
  data?: any;
  message?: string;
}

export interface IdentityKycProps {
  // === New Checker SDK Props (v2.0) ===
  /**
   * Configuration ID for new Checker SDK (v2.0+)
   * Get from: https://dashboard.prembly.com
   */
  configId?: string;

  /**
   * Widget key for new Checker SDK (v2.0+)
   * Get from: https://dashboard.prembly.com
   */
  widgetKey?: string;

  /**
   * Additional metadata to pass to the verification flow (v2.0+)
   */
  metadata?: IdentityKycMetadata;

  /**
   * Callback when verification completes successfully (v2.0+)
   * Replaces onVerified in new API
   */
  onComplete?: (result: IdentityKycResult) => void;

  /**
   * Callback when widget is loaded (v2.0+)
   */
  onLoad?: () => void;

  /**
   * Callback when widget is closed (v2.0+)
   */
  onClose?: (result: IdentityKycResult) => void;

  /**
   * Callback for custom events (v2.0+)
   */
  onEvent?: (event: any) => void;

  /**
   * Auto-open widget on component mount (v2.0+)
   * @default false
   */
  autoOpen?: boolean;

  /**
   * Show/hide close button in modal (v2.0+)
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Text displayed during loading (v2.0+)
   * @default "Loading Prembly Widget..."
   */
  loadingText?: string;

  /**
   * Modal animation type (v2.0+)
   * @default "slide"
   */
  animationType?: 'slide' | 'fade' | 'none';

  // === Legacy Props (v1.x - Backward Compatible) ===
  /**
   * Merchant/Product SDK key (public key) - Legacy API
   * Required if not using configId/widgetKey
   */
  merchant_key?: string;

  /**
   * Configuration ID (widget code) - Legacy API
   * Required if not using configId/widgetKey
   */
  config_id?: string;

  /**
   * User's first name - Legacy API
   */
  first_name?: string;

  /**
   * User's last name - Legacy API
   */
  last_name?: string;

  /**
   * User's email address - Legacy API
   */
  email?: string;

  /**
   * User reference ID - Legacy API
   */
  user_ref?: string;

  /**
   * Test mode flag - Legacy API
   * @default false
   */
  is_test?: boolean;

  /**
   * Callback when verification is successful - Legacy API
   * Use onComplete in new API
   */
  onVerified?: (result: IdentityKycResult) => void;

  /**
   * Callback when user cancels verification - Legacy API
   * Use onClose in new API
   */
  onCancel?: (result: IdentityKycResult) => void;

  // === Common Props (Both APIs) ===
  /**
   * Callback when an error occurs
   */
  onError?: (error: IdentityKycResult) => void;

  /**
   * Text displayed on the default button
   * @default "Verify My Identity"
   */
  buttonText?: string;

  /**
   * Color of the loading spinner
   * @default "purple"
   */
  loaderColor?: string;

  /**
   * Show or hide the default button
   * @default true
   */
  showDefaultButton?: boolean;

  /**
   * Custom button component
   * @param openWidget Function to trigger widget opening
   * @returns Custom button element
   */
  customButton?: (openWidget: () => void) => React.ReactNode;

  /**
   * Custom styles for the default button
   */
  btnStyles?: StyleProp<ViewStyle>;

  /**
   * Custom styles for button text
   */
  textStyles?: StyleProp<TextStyle>;

  /**
   * Custom styles for the container
   */
  containerStyle?: StyleProp<ViewStyle>;
}

export interface IdentityKycRef {
  /**
   * Opens the KYC widget modal programmatically
   */
  open: () => void;

  /**
   * Closes the KYC widget modal programmatically
   */
  close: () => void;
}

/**
 * IdentityKyc Component
 * 
 * React Native wrapper for Prembly Identity & KYC verification widget.
 * Supports both new Checker SDK (v2.0+) and legacy API (v1.x).
 * 
 * @example
 * // New Checker SDK (v2.0+)
 * ```tsx
 * import IdentityKyc from 'react-native-identity-kyc';
 * 
 * <IdentityKyc
 *   configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
 *   widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
 *   metadata={{ user_id: '123' }}
 *   onComplete={(result) => console.log(result)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 * 
 * @example
 * // Legacy API (v1.x - still supported)
 * ```tsx
 * <IdentityKyc
 *   merchant_key="YOUR_KEY"
 *   config_id="YOUR_CONFIG"
 *   first_name="John"
 *   last_name="Doe"
 *   email="john@example.com"
 *   onVerified={(result) => console.log(result)}
 * />
 * ```
 * 
 * @example
 * // With Ref for programmatic control
 * ```tsx
 * const kycRef = useRef(null);
 * 
 * <Button onPress={() => kycRef.current?.open()} />
 * 
 * <IdentityKyc
 *   ref={kycRef}
 *   configId="..."
 *   widgetKey="..."
 *   showDefaultButton={false}
 * />
 * ```
 */
export default class IdentityKyc extends Component<IdentityKycProps> {
  /**
   * Opens the KYC widget modal
   */
  open(): void;

  /**
   * Closes the KYC widget modal
   */
  close(): void;
}
