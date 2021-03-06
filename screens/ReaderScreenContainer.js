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
    Image,
    TextInput
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from '../constants/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { listStyles } from '../constants/list_styles';
import RNFetchBlob from 'rn-fetch-blob'
import { connect } from "react-redux";
import Pagination,{Icon,Dot} from 'react-native-pagination';//{Icon,Dot} also available
class ReaderScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            searched_books: [],
            date: Date.now(),
            refreshnig: false,
            pages_count: 0,
            current_page: 1,
            online: true,
            covers_fired: false,
            downloaded_covers: [],
        }
    }
    static navigationOptions = {
        // title: 'Книги'
    }
    willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
            this.getBooks(this.state.current_page);
        }
    );
    _keyExtractor = (item) => item.id.toString();
    _keyExtractor2 = (item) => item;
    getBooks(offset = 0) {
        console.log('getBooks starts', offset)
        let AStore;
        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
            AStore = 'cache_reader_list_eng';
        } else if (this.props.main.lang == 'es') {
            AStore = 'cache_reader_list_es';
        } else {
            AStore = 'cache_reader_list';
        }
        let request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.status === 200) {
                this.setState(state => {
                    if (request.responseText) {
                        let parsedText;
                        try {
                            parsedText = JSON.parse(request.responseText);
                        } catch (e) {
                            console.log('catched parse json', request)
                            parsedText = {
                                books: [],
                                page_count: 0
                            }
                        }
                        return {
                            ...state,
                            books: parsedText.books,
                            pages_count: parsedText.page_count,
                            online: true
                        }
                    }
                })
                AsyncStorage.setItem(AStore, request.responseText);
            } else {
                console.log('error reader books req');
                AsyncStorage.getItem(AStore, (err, value) => {
                    // console.log('cache_reader_list', value)
                    if (!!value) {
                        this.setState({
                            books: JSON.parse(value).books,
                            online: false,
                        })
                    }
                });
            }
            this.setPagination();
            if (!this.state.covers_fired) {
                this.downloadCovers();
                this.setState({
                    covers_fired: true
                })
            }
        };
        request.open('GET', API_URL + `/get-reader-books?offset=${offset}&lang=${this.props.main.lang}`);
        console.log(API_URL + `/get-reader-books?offset=${offset}&lang=${this.props.main.lang}`)
        request.send();
    }
    componentWillMount() {
        this.getBooks();
    }
    setPagination() {
        try {
            let books_count = this.state.books.length;
            // console.log('setpagination', books_count)
            this.setState({
                pages_count: Math.ceil(books_count / 5)
            });
        } catch (e) {
            console.log('set pag error', e);
        }
    }
    setPage(page_number) {
        this.setState({
            current_page: page_number
        })
    }
    componentDidMount() {
        console.log("CDM")
        // AsyncStorage.clear();
    }
    downloadCovers() {
        console.log('downloadCovers() fired')
        let ASdownloaded_covers;
        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
            ASdownloaded_covers = 'downloaded_covers_eng';
        } else if (this.props.main.lang == 'es') {
            ASdownloaded_covers = 'downloaded_covers_es';
        } else {
            ASdownloaded_covers = 'downloaded_covers';
        }
        AsyncStorage.getItem(ASdownloaded_covers, (err, value) => {
            console.log('downloaded_covers value', value)
            if (value) {
                try {
                    this.downloaded_covers = JSON.parse(value);
                    this.setState({
                        downloaded_covers: this.downloaded_covers
                    })
                    if (this.state.books.length != this.downloaded_covers.length) {
                        this.need_to_download_covers = []
                        this.state.books.forEach(book => {
                            let isDownloaded = false;
                            this.downloaded_covers.forEach(cover => {
                                if (book.id == cover.id) {
                                    isDownloaded = true;
                                }
                            });
                            if (!isDownloaded) {
                                this.need_to_download_covers.push(book);
                            }
                        });
                        this.downloadCoverQueue();
                    }
                } catch (e) {
                    console.log('download covers error', e)
                }
            } else {
                this.downloaded_covers = [];
                this.need_to_download_covers = [].concat(this.state.books);
                this.downloadCoverQueue();
            }
        });
    }
    downloadCoverQueue() {
        if (this.need_to_download_covers.length) {
            console.log('this.need_to_download_covers', this.need_to_download_covers)
            let book_to_download = this.need_to_download_covers[0];
            console.log('book_to_download', book_to_download);
            this.task = RNFetchBlob
                .config({
                    fileCache: true,
                    appendExt: 'jpg',
                })
                .fetch('GET', 'https://app.harekrishna.ru/' + book_to_download.cover_src, {});
            this.task
                .progress((received, total) => {
                    console.log('progress', received / total)
                })
            this.task
                .then((res) => {
                    console.log('The file saved to ', res.path())
                    this.downloaded_covers.push({
                        id: book_to_download.id,
                        file_path: res.path(),
                    })
                    let ASdownloaded_covers;
                    if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
                        ASdownloaded_covers = 'downloaded_covers_eng';
                    } else if (this.props.main.lang == 'es') {
                        ASdownloaded_covers = 'downloaded_covers_es';
                    } else {
                        ASdownloaded_covers = 'downloaded_covers';
                    }
                    AsyncStorage.setItem(ASdownloaded_covers, JSON.stringify(this.downloaded_covers))
                    this.setState({
                        downloaded_covers: this.downloaded_covers,
                    })
                    this.need_to_download_covers.shift();
                    this.downloadCoverQueue();
                });
        } else {
            this.setState({
                downloaded_covers: this.downloaded_covers,
            })
        }
    }
    changeSearchText(text){
      let books = this.state.books;
      let new_books = books.filter(function(item){
        return item.name.toLowerCase().search(
          text.toLowerCase()) !== -1;
      });
      this.setState({
        searched_books: new_books,
      })
    }
    onViewableItemsChanged = ({ viewableItems, changed }) =>{
        console.log('onViewableItemsChanged', viewableItems)
        this.setState({viewableItems})
    }
    render() {
        // console.log('render', this.state)
        console.log('reader redux render');
        let comp;
        // let pagination_arr = [];
        // let books = this.state.books;
        // let searched_books = this.state.searched_books;
        // let need_pagination;
        // if (searched_books.length == 0 || searched_books.length == books.length) {
        //   books = [...new Set(books)];
        //   need_pagination = true;
        //   books_on_page = books.splice((this.state.current_page-1)*5, 5);
        //   if (this.state.pages_count){
        //     for (let i = 1; i <= this.state.pages_count; i++){
        //       pagination_arr.push(i);
        //     }
        //   }
        // } else {
        //   books = [...new Set(searched_books)];
        //   need_pagination = false;
        //   books_on_page = books;
        // }
        // console.log(pagination_arr);
        // console.log('render state', this.state);
        if (true) {
            comp = (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#efefef', justifyContent: 'space-between' }}>
                    <View
                    style={[
                          listStyles.quoteItem,
                          {
                            //   marginLeft: 10,
                            //   marginRight: 10,
                              marginBottom: 5,
                              marginTop: 5,
                              flex: 0,
                              padding: 8,
                          }
                      ]}
                      >
                      <TextInput
                          placeholder={
                            this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                            ? "Search by book name"
                            : this.props.main.lang == 'es'
                            ? "Introduce el título del libro."
                            : "Введите название книги"}
                          onChangeText={text => this.changeSearchText(text)}
                      />
                    </View>
                    <FlatList
                        style={{flex: 0, height: '100%' }}
                        data={this.state.searched_books ? ((this.state.searched_books.length == 0 || this.state.searched_books.length == this.state.books.length) ? this.state.books : this.state.searched_books) : this.state.books}
                        ref={r=>this.refs=r}//create refrence point to enable scrolling
                        onViewableItemsChanged={this.onViewableItemsChanged}//need this
                        renderItem={({ item }) => {
                            // console.log('render item )')
                            let cover_src = false;
                            let view = false;
                            this.state.downloaded_covers.forEach(cover => {
                                if (item.id == cover.id) {
                                    cover_src = cover.file_path;
                                    // console.log('render item 1')
                                    // console.log(cover_src);
                                    view = (
                                        <View style={{ marginRight: 10 }}>
                                            <Image
                                                source={{ uri: 'file://' + cover_src }}
                                                style={{ width: 80, height: 120 }}
                                            />
                                        </View>
                                    )
                                }
                            });
                            if ((!!this.state.online) && (!cover_src)) {
                                cover_src = 'https://app.harekrishna.ru/' + item.cover_src;
                                view = (
                                    <View style={{ marginRight: 10 }}>
                                        <Image
                                            source={{ uri: cover_src }}
                                            style={{ width: 80, height: 120 }}
                                        />
                                    </View>
                                )
                            }
                            if ((!this.state.online) && (!cover_src)) {
                                view = null;
                                // console.log('render item 2')
                                // console.log(this.state.online)
                                // console.log(cover_src)
                            }
                            return (
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Reader', { book_id: item.id, book_name: item.name, book_src: item.file_src })}>
                                    <View style={listStyles.quoteItem}>
                                        <View>
                                            <View style={listStyles.bookTop}>
                                                {view ? view : null}
                                                <View style={{ flexWrap: 'wrap', flex: 1 }}>
                                                    <Text style={listStyles.quoteTitle}>{item.name}</Text>
                                                    <Text style={{ marginTop: 10, color: '#c5c5c5', fontStyle: 'italic' }}>{item.author}</Text>
                                                </View>
                                            </View>
                                            <Text style={{ marginTop: 10 }}>{item.description}</Text>
                                        </View>
                                        {/* <View>
                        <Ionicons name="ios-arrow-forward" size={25} color="tomato"/>
                      </View> */}
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={this._keyExtractor}
                        onRefresh={() => this.getBooks()}
                        refreshing={false}
                    >
                    </FlatList>
                    <Pagination
                        // dotThemeLight //<--use with backgroundColor:"grey"
                        listRef={this.refs}//to allow React Native Pagination to scroll to item when clicked  (so add "ref={r=>this.refs=r}" to your list)
                        paginationVisibleItems={this.state.viewableItems}//needs to track what the user sees
                        paginationItems={this.state.books}//pass the same list as data
                        paginationItemPadSize={3} //num of items to pad above and below your visable items
                        // pagingEnabled={true}
                        paginationStyle={{width: 10, alignItems:"center", justifyContent: 'space-between', position:"absolute", margin:0, bottom:0, right:15, padding:0, top: 0, flex:1,}}
                        dotIconSizeActive={10}
                    />
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
)(ReaderScreenContainer);
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
    },
    pagination: {
        flex: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        maxHeight: 40,
        flexShrink: 0,
    }
})