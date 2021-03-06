import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Animated,
    Linking,
    Easing,
    WebView
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { SITE_URL } from "../constants/api";
import TextTicker from "react-native-text-ticker";
// import { WebView } from "react-native-webview";
// import WKWebView from "react-native-wkwebview-reborn";
import NavigationService from "../NavigationService";
import { connect } from "react-redux";
import { setTag } from "../actions/site";
import {ecadashCityList} from '../constants/ecadash'
import {API_URL} from '../constants/api'
const injectScript = `
// var originalPostMessage = window.postMessage;
// var patchedPostMessage = function(message, targetOrigin, transfer) { 
//   originalPostMessage(message, targetOrigin, transfer);
// };
// patchedPostMessage.toString = function() { 
//   return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage'); 
// };
// window.postMessage = patchedPostMessage;
  (function () {
    window.onclick = function(e) {
        console.log('window clicked');
      e.preventDefault();
      if (e.target.getAttribute('data-target') == 'similar') {
          var data = {
              type: 'similar',
              id: e.target.getAttribute('data-target-id'),
              title: e.target.getAttribute('data-target-title')
          }
          window.postMessage(data);
      } else if (e.target.getAttribute('data-target') == 'tag') {
        var data = {
            type: 'tag',
            id: e.target.getAttribute('data-target-id'),
            title: e.target.getAttribute('data-target-title'),
        }
        window.postMessage(data);
      } else if (e.target.href){
          window.postMessage(e.target.href);
        }
      e.stopPropagation()
    }
  }());
`;

const injectScriptLog = `
var originalPostMessage = window.postMessage;

var patchedPostMessage = function(message, targetOrigin, transfer) { 
  originalPostMessage(message, targetOrigin, transfer);
};

patchedPostMessage.toString = function() { 
  return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage'); 
};

window.postMessage = patchedPostMessage;
  (function () {
    window.onclick = function(e) {
      e.preventDefault();
      window.postMessage(e.target.href);
      e.stopPropagation()
    }
  }());

(function () {
    var originalConsoleLog = console.log || window.console.log;
    var patchedConsoleLog = function (message) {
      originalConsoleLog && originalConsoleLog(message);
      window.postMessage && window.postMessage(message);
    };
    console.log = patchedConsoleLog;
  })();
`;
class ScsmathScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        // console.log("title length", navigation.getParam("title").length);
        return {
            // headerTitle: navigation.getParam("title"),
            // title:
            headerTitle: (
                <View>
                    <Text>scsmath.com</Text>
                </View>
            ),
            rigth: null
        };
    };
    state = {};
    componentDidMount(){
        AsyncStorage.getItem("ecadash_city_chosen", (err, city) => {
            console.log('ecadash city is', city);
            if (!city) {
                city = "moscow";
            }
            AsyncStorage.getItem('Token', (err, token) =>{
                if (token) {
                    let request = new XMLHttpRequest();
                    request.onreadystatechange = (e) => {
                        if (request.readyState !== 4) {
                            return;
                        }
                        if (request.status === 200) {

                        }
                    };
                    request.open('GET', API_URL + `/set-ecadash-city?token=${token}&city=${city}`);
                    request.send();
                    console.log('sent request to', API_URL + `/set-ecadash-city?token=${token}&city=${city}`)
                } else {
                    console.log('lolll')
                }
            })
        })
    }
    render() {
        // console.log('id = ', this.props.navigation.getParam("id"));
        console.log('scs props', this.props)
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: "#eaecfa",
                    // paddingBottom: 10,
                    // paddingTop: 20
                }}
            >
                <WebView
                    source={{
                        uri: `http://app.harekrishna.ru/scs/`
                    }}
                    style={{ backgroundColor: "#efefef"}}
                    // allowsInlineMediaPlayback={true}
                    // mediaPlaybackRequiresUserAction={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={true}
                    injectedJavaScript={injectScriptLog}
                    javaScriptEnabled={true}
                    allowUniversalAccessFromFileURLs={true}
                    mixedContentMode='always'
                    onMessage={({ nativeEvent }) => {
                        console.log("onMessage", nativeEvent);
                        const data = nativeEvent.data;
                        if (typeof data == "string") {
                            if (data !== undefined && data !== null) {
                                Linking.openURL(data);
                            }
                        } else {
                            console.log("its obj?", data);
                            if (data.type == "similar") {
                                NavigationService.navigate("SiteDetail", {
                                    id: data.id,
                                    title: data.title
                                });
                            }
                            if (data.type == "tag") {
                                this.props.setTag({
                                    id: data.id,
                                    title: data.title,
                                    type: "tag"
                                });
                                NavigationService.navigate("SiteTabScreen", {
                                    id: data.id,
                                    title: data.title,
                                    type: "tag"
                                });
                            }
                        }
                    }}
                />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        site: state.siteReducer
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setTag: tag => dispatch(setTag(tag))
        // getItems: (type, offset, q_str, action_type) =>
        // dispatch(getItems(type, offset, q_str, action_type))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScsmathScreen);