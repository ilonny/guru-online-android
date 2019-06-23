import AudioDetailContainer from "./AudioDetailContainer"
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
    SafeAreaView,
    Alert,
    TouchableWithoutFeedback,
    Slider,
    ActivityIndicator,
    Easing
  } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextTicker from "react-native-text-ticker";
import RNFetchBlob from 'rn-fetch-blob'
import {
    setNeedToDownload,
    setDownloadingBook,
    setDownloadTask,
    setDownloadedBooks,
    setGlobalDownloading,
    setNowPlaying
} from '../actions/index'
let dirs = RNFetchBlob.fs.dirs
var Sound = require('react-native-sound');
Sound.setCategory('Playback');
import MusicControl from 'react-native-music-control';
MusicControl.handleAudioInterruptions(true);
export default class AudioScreenDetail extends Component {
    static navigationOptions = ({navigation}) => {
        const bookName = navigation.getParam('book_name');
        const downloadAll = navigation.getParam('downloadAll');
        const downloading = navigation.getParam('downloading');
        const lang = navigation.getParam('lang');
        const cancelTask = navigation.getParam('cancelTask');
        const online = navigation.getParam('online');
        console.log('downloading123', downloading);
        if (online){
            return {
                headerTitle: (
                    <View style={{maxWidth: 230}}>
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
                    <TouchableOpacity onPress={() => downloadAll()}>
                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'column', marginRight: 10}}>
                                <Ionicons name={"ios-cloud-download"} size={25} color="tomato" style={{marginTop: 12}}/>
                                <Text style={{fontSize: 10, marginTop: -7}}>{lang == 'eng' ? 'Download all' : lang == 'es' ? 'Descargar todo' : 'Скачать все'}</Text>
                        </View>
                    </TouchableOpacity>
                ),
            }
        } else {
            return {
                headerTitle: bookName,
                headerRight: null,
            }
        }
    }
    render(){
        return <AudioDetailContainer navigation={this.props.navigation}/>
    }
}