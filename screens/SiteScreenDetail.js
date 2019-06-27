import SiteScreenDetailContainer from "./SiteScreenDetailContainer"
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
    WebView,
    Linking,
    Easing,
} from "react-native";
import TextTicker from "react-native-text-ticker";
export default class SiteScreenDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        console.log('title length', navigation.getParam("title").length);
        return {
            // headerTitle: navigation.getParam("title"),
            // title:
            headerTitle: (
                <View >
                    <TextTicker
                        style={{ fontSize: 14 }}
                        duration={navigation.getParam("title").length*238}
                        loop
                        bounce
                        repeatSpacer={50}
                        marqueeDelay={1000}
                        easing={Easing.linear}
                        >
                        {navigation.getParam("title")}
                    </TextTicker>
                </View>
            ),
            rigth: null,
        };
    };
    render(){
        return <SiteScreenDetailContainer navigation={this.props.navigation}/>
    }
}