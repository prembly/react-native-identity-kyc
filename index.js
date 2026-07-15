/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *  AUTHOR -  KAYODE OLAYIWOLA
 * @format
 * @flow
 */

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { WebView } from "react-native-webview";

function IdentityKyc(props, ref) {
  const [isLoading, setisLoading] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [widgetUrl, setWidgetUrl] = useState(null);
  const [sessionError, setSessionError] = useState(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (props.autoOpen) {
      setshowModal(true);
    }
  }, [props.autoOpen]);

  // Initiate widget session when modal opens
  useEffect(() => {
    if (showModal && props.configId && props.widgetKey && !widgetUrl) {
      initiateSession();
    }
  }, [showModal, props.configId, props.widgetKey]);

  // Function to initiate session with Prembly backend
  const initiateSession = async () => {
    try {
      console.log('[Prembly] Initiating session...');
      setisLoading(true);
      setSessionError(null);

      const metadata = props.metadata || {};
      
      const response = await fetch(
        'https://backend.prembly.com/api/v1/checker-widget/sdk/sessions/initiate/',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: metadata.first_name || metadata.firstName || '',
            last_name: metadata.last_name || metadata.lastName || '',
            email: metadata.email || '',
            widget_id: props.configId,
            widget_key: props.widgetKey,
            ...metadata, // Include any additional metadata
          }),
        }
      );

      const result = await response.json();
      console.log('[Prembly] Session response:', result);

      if (result.status && result.data && result.data.session) {
        const sessionId = result.data.session.session_id;
        const verificationUrl = `https://dv7wajvnnyl16.cloudfront.net/?session=${sessionId}`;
        
        console.log('[Prembly] Session created:', sessionId);
        console.log('[Prembly] Loading widget from:', verificationUrl);
        
        setWidgetUrl(verificationUrl);
        
        if (props.onLoad) {
          props.onLoad();
        }
      } else {
        const errorMsg = result.message || 'Failed to initiate session';
        console.error('[Prembly] Session error:', errorMsg);
        setSessionError(errorMsg);
        
        if (props.onError) {
          props.onError({
            status: 'error',
            message: errorMsg,
          });
        }
      }
    } catch (error) {
      console.error('[Prembly] Session initiation error:', error);
      setSessionError(error.message);
      
      if (props.onError) {
        props.onError({
          status: 'error',
          message: 'Failed to connect to Prembly: ' + error.message,
        });
      }
    } finally {
      setisLoading(false);
    }
  };

  // Expose open and close methods via ref
  useImperativeHandle(ref, () => ({
    open: () => {
      setshowModal(true);
    },
    close: () => {
      setshowModal(false);
    },
  }));

  const onWebMessageReceived = (data) => {
    try {
      var response = JSON.parse(data);
      console.log('Prembly SDK Event:', response);

      switch (response.event) {
        case "debug":
          // Log debug messages from WebView
          console.log('[WebView Debug]', response.message);
          break;

        case "closed":
        case "close":
          setshowModal(false);
          if (props.onCancel) {
            props.onCancel({ status: "closed" });
          }
          if (props.onClose) {
            props.onClose({ status: "closed" });
          }
          break;

        case "error":
          console.error('[WebView Error]', response.message);
          setshowModal(false);
          if (props.onError) {
            props.onError({ 
              status: "error", 
              message: response.message || response.data?.message 
            });
          }
          break;

        case "verified":
        case "complete":
          setshowModal(false);
          const resultData = {
            status: "success",
            data: response.data || response,
          };
          // Support both old (onVerified) and new (onComplete) callbacks
          if (props.onVerified) {
            props.onVerified(resultData);
          }
          if (props.onComplete) {
            props.onComplete(resultData);
          }
          break;

        case "loaded":
          console.log('[Prembly SDK] Widget loaded successfully');
          if (props.onLoad) {
            props.onLoad();
          }
          break;

        default:
          // Handle custom events
          if (props.onEvent) {
            props.onEvent(response);
          }
          break;
      }
    } catch (error) {
      console.error('Error parsing Prembly SDK message:', error);
    }
  };

  const showIdentityModal = () => {
    setshowModal(true);
  };

  const closeModal = () => {
    setshowModal(false);
    setWidgetUrl(null); // Reset widget URL when closing
    setSessionError(null);
    if (props.onClose) {
      props.onClose({ status: "closed" });
    }
  };

  // Generate WebView source for widget
  const getWidgetSource = () => {
    // For new API with session-based approach
    if (widgetUrl) {
      console.log('[Prembly SDK] Loading widget from session URL');
      return { uri: widgetUrl };
    }
    
    // Check if using legacy API
    const useLegacyAPI = props.merchant_key && props.config_id;
    
    if (useLegacyAPI) {
      // Legacy URL-based approach for backward compatibility
      const params = new URLSearchParams({
        merchantKey: props.merchant_key || '',
        firstName: props.first_name || '',
        lastName: props.last_name || '',
        email: props.email || '',
        config_id: props.config_id || '',
        user_ref: props.user_ref || '',
        isTest: props.is_test ? 'true' : 'false',
      }).toString();
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; }
            iframe { width: 100%; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <iframe src="https://mobile.prembly.com/v2/?${params}"></iframe>
          <script>
            window.addEventListener('message', function(event) {
              window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
            });
          </script>
        </body>
        </html>
      `;
      
      return { html };
    }
    
    // Placeholder while session is being created
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f7f9fc;
          }
          .loading {
            text-align: center;
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #6c5ce7;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="loading">
          <div class="spinner"></div>
          <p>Initializing verification...</p>
        </div>
      </body>
      </html>
    `;
    
    return { html };
  };

  const button = props.customButton ? (
    props.customButton(showIdentityModal)
  ) : (
    <TouchableOpacity
      style={props.btnStyles}
      onPress={() => showIdentityModal()}
    >
      <Text style={props.textStyles}>{props.buttonText}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[{ flex: 1 }, props.containerStyle]}>
      <Modal
        style={[{ flex: 1 }]}
        visible={showModal}
        animationType={props.animationType || "slide"}
        transparent={false}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={[{ flex: 1 }]}>
          {props.showCloseButton && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 10,
              backgroundColor: '#f8f9fa',
              borderBottomWidth: 1,
              borderBottomColor: '#e9ecef',
            }}>
              <TouchableOpacity
                onPress={closeModal}
                style={{
                  padding: 8,
                  paddingHorizontal: 16,
                  backgroundColor: '#dc3545',
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: '#ffffff', fontWeight: '600' }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <WebView
            ref={webViewRef}
            key={widgetUrl || 'placeholder'} // Force re-render when URL changes
            style={[{ flex: 1 }]}
            source={getWidgetSource()}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            mixedContentMode="always"
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            onMessage={(e) => {
              onWebMessageReceived(e.nativeEvent.data);
            }}
            onLoadStart={() => {
              console.log('[WebView] Load started');
              setisLoading(true);
            }}
            onLoadEnd={() => {
              console.log('[WebView] Load ended');
              setisLoading(false);
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('[WebView] Error:', nativeEvent);
              setisLoading(false);
              if (props.onError) {
                props.onError({
                  status: 'error',
                  message: 'Failed to load widget: ' + (nativeEvent.description || 'Unknown error')
                });
              }
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('[WebView] HTTP Error:', nativeEvent.statusCode, nativeEvent.url);
            }}
            renderError={(errorName) => {
              console.error('[WebView] Render Error:', errorName);
              return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                    Failed to Load Widget
                  </Text>
                  <Text style={{ textAlign: 'center', color: '#666' }}>
                    Error: {errorName}
                  </Text>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={{
                      marginTop: 20,
                      padding: 12,
                      paddingHorizontal: 24,
                      backgroundColor: '#dc3545',
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: '600' }}>Close</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          {isLoading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <ActivityIndicator size="large" color={props.loaderColor} />
              {props.loadingText && (
                <Text style={{ marginTop: 12, color: '#6c757d' }}>
                  {props.loadingText}
                </Text>
              )}
            </View>
          )}
        </SafeAreaView>
      </Modal>
      {props.showDefaultButton && button}
    </SafeAreaView>
  );
}

export default forwardRef(IdentityKyc);

IdentityKyc.defaultProps = {
  buttonText: "Verify My Identity",
  loaderColor: "purple",
  isTest: false,
  showDefaultButton: true,
  showCloseButton: true,
  autoOpen: false,
  animationType: "slide",
  loadingText: "Loading Prembly Widget...",
};
  