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
    Easing
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import WKWebView from "react-native-wkwebview-reborn";
import CalendarScreen from "./CalendarScreen";
const CalendarRoute = (sceneProps) => <CalendarScreen sceneProps={sceneProps} />;
const SiteEs1 = () => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#eaecfa",
                // // paddingBottom: 10,
                // // paddingTop: 20
            }}
        >
            <WKWebView
                source={{
                    uri: `https://app.harekrishna.ru/es/`
                }}
                style={{
                    backgroundColor: "#efefef",
                    // paddingTop: 20,
                    // marginTop: 20
                }}
                // allowsInlineMediaPlayback={true}
                // mediaPlaybackRequiresUserAction={true}
                injectedJavaScript={injectScript}
                allowUniversalAccessFromFileURLs={true}
                mixedContentMode='always'
                onMessage={({ nativeEvent }) => {
                    console.log("onMessage", nativeEvent);
                    const data = nativeEvent.data;
                    if (typeof data == "string") {
                        if (data !== undefined && data !== null) {
                            Linking.openURL(data);
                        }
                    }
                }}
            />
        </SafeAreaView>
    );
};
const SiteEs2 = () => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#eaecfa",
                // // paddingBottom: 10,
                // // paddingTop: 20
            }}
        >
            <WKWebView
                source={{
                    uri: `https://app.harekrishna.ru/es/site-2`
                }}
                style={{
                    backgroundColor: "#efefef",
                    // paddingTop: 20,
                    // marginTop: 20
                }}
                // allowsInlineMediaPlayback={true}
                // mediaPlaybackRequiresUserAction={true}
                injectedJavaScript={injectScript}
                allowUniversalAccessFromFileURLs={true}
                mixedContentMode='always'
                onMessage={({ nativeEvent }) => {
                    console.log("onMessage", nativeEvent);
                    const data = nativeEvent.data;
                    if (typeof data == "string") {
                        if (data !== undefined && data !== null) {
                            Linking.openURL(data);
                        }
                    }
                }}
            />
        </SafeAreaView>
    );
};

class SiteScreenEs extends Component {
    state = {
        needRedirectCalendar: this.props.navigation.getParam('c_date', '') ? true : false,
        index: 0,
        routes: [
            { key: "site1", title: "sadhusangamexico.wordpress.com" },
            { key: "calendar", title: "Vaishnava calendar", lang: 'en', needRedirectCalendar: this.props.navigation.getParam('c_date', '') ? true : false },
            { key: "site2", title: "paramakaruna.org.ve" },
        ]
    };
    _handleIndexChange = index => this.setState({ index });
    _renderTabBar = props => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
            tabStyle={styles.tab}
            labelStyle={styles.label}
            renderLabel={this._renderLabel}
        />
    );
    _renderLabel = route => {
        // console.log('route', route.route)
        return (
            <Text style={styles.label} numberOfLines={1}>
                {route.route.title}
            </Text>
        );
    };
    _renderScene = SceneMap({
        site1: SiteEs1,
        site2: SiteEs2,
        calendar: CalendarRoute,
    });
    render() {
        return (
            <TabView
                navigationState={this.state}
                renderScene={this._renderScene}
                renderTabBar={this._renderTabBar}
                onIndexChange={this._handleIndexChange}
            />
        );
    }
}

export default SiteScreenEs;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabbar: {
        paddingTop: 13,
        backgroundColor: "#f7f7f7"
    },
    tab: {
        width: 280
        // flex: 1
    },
    indicator: {
        backgroundColor: "#75644f"
    }
    // label: {
    //     color: "#75644f",
    //     fontWeight: "400",
    //     padding: 0,
    //     // width: 300,
    //     textAlign: "center",
    //     flex: 1
    // }
});

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