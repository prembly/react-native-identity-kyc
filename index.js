/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *  AUTHOR -  KAYODE OLAYIWOLA
 * @format
 * @flow
 */

import React, { forwardRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

function IdentityKyc(props, ref) {
  const [isLoading, setisLoading] = useState(true);
  const [showModal, setshowModal] = useState(false);

  useEffect(() => {}, []);

  const onWebMessageReceived = (data) => {
    var response = JSON.parse(data);
    console.log(response);
    switch (response.event) {
      case "closed":
        setshowModal(false);
        props.onCancel({ status: "closed" });
        break;
      case "error":
        setshowModal(false);
        props.onError({ status: "error", message: response.message });
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
        <SafeAreaView style={[{ flex: 1 }]}>
          <WebView
            mediaPlaybackRequiresUserAction={false}
            style={[{ flex: 1 }]}
            source={{
              uri:
                "https://mobile-kyc.myidentitypass.com?merchantKey=" +
                props.merchant_key +
                "&firstName=" +
                props.first_name +
                "&lastName=" +
                props.last_name +
                "&email=" +
                props.email +
                "&user_ref=" +
                props.userRef +
                "&isTest=" +
                props.isTest,
            }}
            onMessage={(e) => {
              onWebMessageReceived(e.nativeEvent.data);
            }}
            onLoadStart={() => setisLoading(true)}
            onLoadEnd={() => setisLoading(false)}
          />

          {isLoading && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color={props.loaderColor} />
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
};
