import ReaderScreenDetailContainer from "./ReaderScreenDetailContainer"
import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Animated,
    Modal,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Slider,
    Alert,
    Easing
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TextTicker from "react-native-text-ticker";
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class ReaderScreenDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        console.log('NAVIGATION OPTIONS FIRED', navigation)
        const toggleNavigation = navigation.getParam('toggleNavigation');
        const toggleSettings = navigation.getParam('toggleSettings');
        const bookName = navigation.getParam('book_name');
        const theme = navigation.getParam('theme');
        const pageHaveBookmark = navigation.getParam('pageHaveBookmark');
        const showBookmarkPopup = navigation.getParam('showBookmarkPopup');
        const deleteBookmark = navigation.getParam('deleteBookmark');
        return {
            headerTitle: (
                <View style={{maxWidth: 200}}>
                    <TextTicker
                        style={{ fontSize: 14 }}
                        duration={bookName.length*238}
                        loop
                        bounce
                        repeatSpacer={50}
                        marqueeDelay={1000}
                        easing={Easing.linear}
                        >
                        {bookName}
                    </TextTicker>
                </View>
            ),
            headerRight: (
                // <TouchableOpacity onPress={navigation.getParam('consoleState')}>
                <View style={{ alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => pageHaveBookmark ? deleteBookmark() : showBookmarkPopup()}>
                        <Ionicons name="ios-bookmark" size={30} color={theme == 'light' ? 'tomato' : '#c1ae97'} style={{ marginTop: 5, marginRight: 15, marginLeft: 10 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleSettings()}>
                        <Ionicons name={"ios-cog"} size={30} color={theme == 'light' ? 'tomato' : '#c1ae97'} style={{ marginTop: 5, marginRight: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleNavigation()}>
                        <Ionicons name={"ios-list"} size={35} color={theme == 'light' ? 'tomato' : '#c1ae97'} style={{ marginTop: 5 }} />
                    </TouchableOpacity>
                </View>
            ),
            // title: 'test',
            headerTitleStyle: {
                color: theme == 'light' ? '#000' : '#bebebe',
                width: 180
            },
            headerStyle: {
                paddingRight: 10,
                backgroundColor: theme == 'light' ? '#fff' : '#171717',
            },
        }
    }
    render(){
        console.log('READER FOOL RENDER');
        return <ReaderScreenDetailContainer navigation={this.props.navigation}/>
    }
}