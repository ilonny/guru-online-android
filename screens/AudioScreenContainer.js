import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from '../constants/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { listStyles } from '../constants/list_styles';
import { connect } from "react-redux";

class AudioScreenContainer extends Component {
    constructor(props){
      super(props);
      this.state = {
        books: [],
        date: Date.now(),
        refreshnig: false,
        online: true,
        loading: false,
      }
    }
    static navigationOptions = {
      // title: 'Аудиокниги'
    }
    willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
          this.getBooks();
      }
    );
    _keyExtractor = (item) => item.text_short + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    getBooks(){
        console.log('getBooks starts')
        let request = new XMLHttpRequest();
        this.setState({
          loading: true
        })
        request.onreadystatechange = (e) => {
            if (request.status === 200) {
                this.setState(state => {
                  if (request.responseText){
                    let parsedText;
                    try {
                      parsedText = JSON.parse(request.responseText);
                    } catch (e){
                    //   console.log('catched parse json', request)
                      parsedText = [];
                    }
                    return {
                        ...state,
                        books: parsedText,
                        online: true,
                        loading: false,
                    }
                }
                })
                AsyncStorage.setItem('cached_audio_list', request.responseText);
            } else {
              console.log('error req', API_URL + `/get-audio-books?lang=${this.props.main.lang}`)
              let cached_audio_list;
              if (this.props.main.lang == 'eng' || this.props.main.lang == 'en'){
                cached_audio_list = 'cached_audio_list_eng';
              } else if (this.props.main.lang == 'es') {
                cached_audio_list = 'cached_audio_list_es';
              } else {
                cached_audio_list = 'cached_audio_list';
              }
              AsyncStorage.getItem(cached_audio_list, (err, value) => {
                // console.log('cached_audio_list', value)
                if (!!value){
                    try {
                        this.setState({
                            books: JSON.parse(value),
                            online: false,
                            loading: false,
                        })
                    } catch (e){
                        console.log('crash!', e)
                    }
                }
              });
            }
        };
        request.open('GET', API_URL + `/get-audio-books?lang=${this.props.main.lang}`);
        request.send();
    }
    componentWillMount(){
        this.getBooks();
    }
    shouldComponentUpdate(nextProps, nextState){
        if (this.state.books.length == nextState.books.length){
            return false;
        }
        return true;
    }
    render() {
        console.log('render', this.state)
        let comp;
        if (true) {
          comp = (
            <SafeAreaView style={{flex: 1, backgroundColor: '#F5FCFF', paddingBottom: 10, paddingTop: 10}}>
                <FlatList
                    data={this.state.books}
                    renderItem={({item}) => (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Audio', {book_id: item.id, book_name: item.name, book_src: item.file_src, online: this.state.online, lang: this.props.main.lang})}>
                        <View style={listStyles.quoteItem}>
                            <Text style={listStyles.quoteTitle}>{item.name}</Text>
                            <View style={listStyles.quoteBottom}>
                                <View style={listStyles.quoteBottomText}>
                                    {item.text_short && (<Text style={{color: "#808080"}}>{item.description}</Text>)}
                                    <Text style={{marginTop: 10, color: '#c5c5c5', fontStyle: 'italic'}}>{item.author}</Text>
                                </View>
                                <View style={listStyles.arrowCircle}>
                                    <View style={listStyles.arrowCircleInside}>
                                        <Ionicons name="ios-arrow-forward" size={40} color="#fff"/>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={this._keyExtractor}
                  onRefresh={() => this.getBooks()}
                  refreshing={false}
                >
                </FlatList>
            </SafeAreaView>
          );
        }
        return comp;
    }
}
const mapStateToProps = state => {
  return {
      main: state.mainReducer,
  };
};
const mapDispatchToProps = dispatch => {
  return {
      // setLangInside: lang => dispatch(setLangInside(lang))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioScreenContainer);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      paddingTop: 25,
      paddingBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: '#eaeaea'
    }
  })