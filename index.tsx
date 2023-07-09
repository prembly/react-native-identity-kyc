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
  


 interface Props{
  merchant_key:string,
  email:string,
  first_name:number,
  last_name:any,
  userRef:any,
  isTest:boolean,
  onCancel:Function,
  onVerified:Function,
  customButton?:any,
  btnStyles?:any,
  textStyles:any,
  buttonText:any,
  containerStyle?:any,
  loaderColor:any,
  showDefaultButton:Boolean,
  onError:Function
}


  function IdentityKyc(props:Props) {
    const [isLoading, setisLoading] = useState(true);
    const [showModal, setshowModal] = useState(false);
  
    useEffect(() => {
      
    }, []);
 
  
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
              source={{ uri: "https://mobile.prembly.com?merchantKey=" +
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
              props.isTest}}
              
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
  
  IdentityKyc.defaultProps = {
    buttonText: "Verify My Identity",
    loaderColor: "purple",
    isTest: false,
    showDefaultButton: true,
  };

  export default forwardRef<Props>((props) => {
    return <IdentityKyc {...props}/>
 });
 
  