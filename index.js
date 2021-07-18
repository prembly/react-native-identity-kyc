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
  
    useEffect(() => {
      
    }, []);
  
    const identityKycWebcontent = `   
        <!DOCTYPE html>
        <html lang="en">
                <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Identity Pass</title>
                </head>
                <body  onload="verifyKYC()" style="background-color:#fff;height:100vh ">
                        <script src="https://js.myidentitypay.com/v1/inline/kyc.js"></script>
                        <script type="text/javascript">
                                window.onload = verifyKYC;
                                function verifyKYC(){

                                    var paymentEngine =  IdentityKYC.verify({
                                        merchant_key: "${props.merchant_key}",
                                        first_name: "${props.first_name}",
                                        last_name: "${props.last_name}",
                                        email: "${props.email}",
                                        callback: function (response) {
                                           console.log("callback Response", response); 
                                           if(response.status =='success'){
                                            var response_data = {event:'verified', data:response};
                                            window.ReactNativeWebView.postMessage(JSON.stringify(response_data))
                                           }
                                           else if(response.code == 'E01'){
                                            var response_data = {event:'closed'};
                                            window.ReactNativeWebView.postMessage(JSON.stringify(response_data))
                                           }
                                           else{
                                            var response_data = {event:'error',message:response.message};
                                            window.ReactNativeWebView.postMessage(JSON.stringify(response_data))
                                           }
                                           
                                      },
                                    })
                                }
 
                        </script> 
                </body>
        </html> 
        `;
  
    const onWebMessageReceived = (data) => {
      var response = JSON.parse(data);
      switch (response.event) {
        case "closed":
          setshowModal(false);
          props.onCancel({ status: "closed" });
          break;
        case "error":
            setshowModal(false);
            props.onError({ status: "error",message:response.message });
            break;
        case "verified":
          setshowModal(false);
          props.onVerified({
            status: "success",
            data: response,
          });
          break;
        default:
          break;
      }
    };
  
    const showIdentityModal = () => {
      setshowModal(true);
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
          animationType="slide"
          transparent={false}
        >
          <SafeAreaView style={[{ flex: 1}]}>
            <WebView
              style={[{ flex: 1 }]}
              source={{ html: identityKycWebcontent }}
              onMessage={(e) => {
                onWebMessageReceived(e.nativeEvent.data);
              }}
              onLoadStart={() => setisLoading(true)}
              onLoadEnd={() => setisLoading(false)}
            />
  
            {isLoading && (
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator
                  size="large"
                  color={props.loaderColor}
                />
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
    showDefaultButton: true,
  };
  