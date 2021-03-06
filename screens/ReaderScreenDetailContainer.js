import React, { Component } from 'react';
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
import { Epub, Streamer } from "epubjs-rn";
import { API_URL } from '../constants/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dialog from "react-native-dialog";
import TextTicker from "react-native-text-ticker";
import { connect } from "react-redux";

class ReaderScreenDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flow: "paginated", // paginated || scrolled-continuous
            location: 0,
            // url: `https://app.harekrishna.ru/api/get-reader-book?id=${this.props.navigation.getParam("book_id")}`,
            url: `https://app.harekrishna.ru/${this.props.navigation.getParam("book_src")}`,
            src: "",
            origin: "",
            title: "",
            toc: [],
            showBars: true,
            showNav: false,
            sliderDisabled: true,
            successLoaded: false,
            reader_locations: [],
            book_id: this.props.navigation.getParam("book_id"),
            nav_opened: false,
            book_locations: [],
            total_locations: 0,
            current_location_index: 0,
            progress_width: 0,
            theme: 'light',
            online: true,
            themes: {
                light: {
                    body: {
                        "-webkit-user-select": "none",
                        "user-select": "none",
                        "background-color": "#fff",
                        "color": "#000"
                    },
                },
                dark: {
                    body: {
                        "-webkit-user-select": "none",
                        "user-select": "none",
                        "background-color": "#171717",
                        "color": "#bebebe"
                    },
                    a: {
                        "color": "#75644f"
                    }
                }
            },
            fontSize: 16,
            settingsOpened: false,
            bookmarks: [],
            bookmarksDialogVisible: false,
            bookmarksDialogComment: '',
            pageHaveBookmark: false,
            listScreen: 'content',
        };
        this.streamer = new Streamer();
        console.log('constructor props: ', this.props)
    }

    static navigationOptions = ({ navigation }) => {
        console.log('NAVIGATION OPTIONS FIRED')
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
    componentDidMount() {
        let AStore;
        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
            AStore = 'reader_locations_eng';
        } else if (this.props.main.lang == 'es') {
            AStore = 'reader_locations_es';
        } else {
            AStore = 'reader_locations';
        }
        this.streamer.start()
            .then((origin) => {
                this.setState({ origin })
                return this.streamer.get(this.state.url);
            })
            .then((src) => {
                return this.setState({ src });
            });
            if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
                AStore = 'reader_locations_eng';
            } else if (this.props.main.lang == 'es') {
                AStore = 'reader_locations_es';
            } else {
                AStore = 'reader_locations';
            }
            AsyncStorage.getItem(AStore, (err, value) => {
            if (value) {
                console.log('async storage reader_locations value ', value);
                this.setState({
                    reader_locations: JSON.parse(value)
                })
                this.getInitialLocation()
            } else {
                console.log('async storage reader_locations value is empty', value);
            }
        })
        let AStore2;
        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en'){
                AStore2 = 'reader_theme_eng';
            } else if (this.props.main.lang == 'es') {
                AStore2 = 'reader_theme_es';
            } else {
                AStore2 = 'reader_theme';
            }
        AsyncStorage.getItem(AStore2, (err, value) => {
            if (value) {
                console.log('async storage reader_theme value ', value);
                this.setState({
                    theme: value
                })
                this.props.navigation.setParams({ theme: this.state.theme })
            } else {
                console.log('async storage reader_theme value is empty', value);
                AsyncStorage.setItem(AStore2, 'light');
            }
        })
        //get tocs from server
        let request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.status === 200) {
                // console.log('response: ', request.responseText)
                this.setState(state => {
                    if (request.responseText) {
                        let parsedText;
                        try {
                            parsedText = JSON.parse(request.responseText);
                        } catch (e) {
                            console.log('catched parse json', request)
                            parsedText = [];
                        }
                        return {
                            ...state,
                            book_locations: parsedText,
                            online: true,
                        }
                    }
                })
                let cached_toc_book_;
                if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
                    cached_toc_book_ = 'cached_toc_book_eng';
                } else if (this.props.main.lang == 'es') {
                    cached_toc_book_ = 'cached_toc_book_es';
                } else {
                    cached_toc_book_ = 'cached_toc_book_';
                }
                AsyncStorage.setItem(cached_toc_book_ + this.state.book_id, request.responseText);
            } else {
                console.log('failed reques', request)
                let cached_book_;
                if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
                    cached_book_ = 'cached_book_eng';
                } else if (this.props.main.lang == 'es') {
                    cached_book_ = 'cached_book_es';
                } else {
                    cached_book_ = 'cached_book_';
                }
                AsyncStorage.getItem(cached_book_ + this.state.book_id, (err, value) => {
                    console.log('cache_book', value)
                    if (!!value) {
                        console.log('it should to open...')
                        let cached_toc_book_;
                        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
                            cached_toc_book_ = 'cached_toc_book_eng';
                        } else if (this.props.main.lang == 'es'){
                            cached_toc_book_ = 'cached_toc_book_es';
                        } else {
                            cached_toc_book_ = 'cached_toc_book_';
                        }
                        AsyncStorage.getItem(cached_toc_book_ + this.state.book_id, (err, value) => {
                            // console.log('cache_reader_list', value)
                            if (!!value) {
                                this.setState({
                                    book_locations: JSON.parse(value),
                                    online: false
                                })
                            }
                        });
                    } else {
                        setTimeout(() => {
                            if (!this.state.successLoaded) {
                                Alert.alert(this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                                ? 'Some problems with connection'
                                : this.props.main.lang == 'es'
                                ? 'Algunos problemas con la conexión'
                                : 'Необходимо подключение к интернету для загрузки книги')
                            }
                        }, 9000);
                    }
                });
            }
        };
        request.open('GET', API_URL + `/get-tocs?book_id=${this.state.book_id}&lang=${this.props.main.lang}`);
        request.send();
        //получаем закладки с нужной книги
        let reader_bookmarks_;
        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
            reader_bookmarks_ = 'reader_bookmarks_eng';
        } else if (this.props.main.lang == 'es' ){
            reader_bookmarks_ = 'reader_bookmarks_es';
        } else {
            reader_bookmarks_ = 'reader_bookmarks_';
        }
        AsyncStorage.getItem(reader_bookmarks_ + this.state.book_id, (err, value) => {
            if (value) {
                console.log('reader_bookmarks_' + this.state.book_id, value);
                this.setState({
                    bookmarks: JSON.parse(value)
                })
            } else {
                console.log('reader_bookmarks_' + this.state.book_id, value);
            }
        });
        this.props.navigation.setParams({ toggleNavigation: this.toggleNavigation })
        this.props.navigation.setParams({ toggleSettings: this.toggleSettings })
        this.props.navigation.setParams({ theme: this.state.theme })
        this.props.navigation.setParams({ showBookmarkPopup: this.showBookmarkPopup })
        this.props.navigation.setParams({ deleteBookmark: this.deleteBookmark })
    }
    showBookmarkPopup = () => {
        this.setState({ bookmarksDialogVisible: true })
    }
    addBookmark = () => {
        console.log('addBookmark()', this.state)
        let comment = this.state.bookmarksDialogComment;
        let location = this.state.visibleLocation.start.cfi;
        let book_id = this.state.book_id;
        let toc_title;
        this.state.book_locations.forEach(chapter => {
            console.log(chapter.app_href, this.state.visibleLocation.start.href);
            if (chapter.app_href == this.state.visibleLocation.start.href) {
                toc_title = chapter.title
            }
        })
        let bookmarks = this.state.bookmarks.concat({
            book_id: book_id,
            location: location,
            comment: comment,
            toc_title: toc_title,
        });
        this.setState({ bookmarks: bookmarks, bookmarksDialogVisible: false })
        let reader_bookmarks_;
        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
            reader_bookmarks_ = 'reader_bookmarks_eng';
        } else if (this.props.main.lang == 'es'){
            reader_bookmarks_ = 'reader_bookmarks_es';
        } else {
            reader_bookmarks_ = 'reader_bookmarks_';
        }
        AsyncStorage.setItem(reader_bookmarks_ + this.state.book_id, JSON.stringify(bookmarks));
    }
    deleteBookmark = (location = '') => {
        if (location == '') {
            location = this.state.visibleLocation.start.cfi;
        }
        let { bookmarks } = this.state;
        bookmarks.forEach((bookmark, index) => {
            if (bookmark.location == location) {
                bookmarks.splice(index, 1);
            }
        });
        this.setState({
            bookmarks: [].concat(bookmarks)
        });
        let reader_bookmarks_;
        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
            reader_bookmarks_ = 'reader_bookmarks_eng';
        } else if (this.props.main.lang == 'es'){
            reader_bookmarks_ = 'reader_bookmarks_es';
        } else {
            reader_bookmarks_ = 'reader_bookmarks_';
        }
        AsyncStorage.setItem(reader_bookmarks_ + this.state.book_id, JSON.stringify(bookmarks));
        console.log('delete bookmark', location)
        setTimeout(() => {
            this.checkPageHaveBookmark();
        }, 300);
    }
    checkPageHaveBookmark() {
        let flag;
        this.state.bookmarks.forEach(bookmark => {
            console.log('checkPageHaveBookmark()', bookmark.location == this.state.visibleLocation.start.cfi, bookmark.location, this.state.visibleLocation.start.cfi);
            if (bookmark.location == this.state.visibleLocation.start.cfi) {
                flag = true;
            } else {
                flag = false;
            }
        });
        this.setState({
            pageHaveBookmark: flag
        });
        this.props.navigation.setParams({ pageHaveBookmark: flag });
    }
    setTheme(theme) {
        this.props.navigation.setParams({ theme: theme })
        this.setState({
            theme: theme
        })
        let reader_theme;
        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
            reader_theme = 'reader_theme_eng';
        } else if (this.props.main.lang == 'es') {
            reader_theme = 'reader_theme_es';
        } else {
            reader_theme = 'reader_theme';
        }
        AsyncStorage.setItem(reader_theme, theme);
    }
    defineBookLocations() {
        console.log('defineBookLocations', book);
        // this.setState({
        //     book_locations: book.navigation.toc
        // })
    }
    checkInitialLocation() {
        this.toc_from_nav = this.props.navigation.getParam('toc');
        if (this.toc_from_nav && this.state.successLoaded) {
            this.setState({
                location: this.toc_from_nav,
                nav_opened: false
            });
        }
    }
    willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
            this.checkInitialLocation();
        }
    );
    componentWillUnmount() {
        console.log('epub reader unmount')
        this.streamer.kill();
    }

    toggleBars() {
        this.setState({ showBars: !this.state.showBars });
    }

    saveBookLocation(location, book_id) {
        console.log('saveBookLocation', location, book_id)
        let { reader_locations } = this.state
        console.log('reader_locations', reader_locations)
        let changed = false;
        reader_locations.forEach(el => {
            if (el.id == book_id) {
                changed = true;
                el.location = location
                this.setState({
                    reader_locations: [].concat(reader_locations)
                })
            }
        });
        if (!changed) {
            console.log('not changed')
            let new_location = {
                id: book_id,
                location: location
            }
            console.log('new location', new_location)
            this.setState({
                reader_locations: this.state.reader_locations.concat(new_location)
            })
        }
        console.log('saveBookLocation end', JSON.stringify(reader_locations))
        let ASreader_locations;
        if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
            ASreader_locations = 'reader_locations_eng';
        } else if (this.props.main.lang == 'es') {
            ASreader_locations = 'reader_locations_es';
        } else {
            ASreader_locations = 'reader_locations';
        }
        AsyncStorage.setItem(ASreader_locations, JSON.stringify(reader_locations))  
        this.checkPageHaveBookmark();
    }

    getInitialLocation() {
        let { book_id, reader_locations } = this.state
        if (reader_locations instanceof Array) {
            reader_locations.forEach(element => {
                if (element.id == book_id) {
                    this.setState({
                        location: element.location
                    })
                    // this.forceUpdate();
                }
            });
        }
    }

    toggleNavigation = () => {
        this.setState({
            nav_opened: !this.state.nav_opened
        })
    }
    toggleSettings = () => {
        this.setState({
            settingsOpened: !this.state.settingsOpened
        })
    }

    redirectToAudio(audio_book_id, audiofile_id, audio_book_name) {
        console.log('redirectToAudio', audio_book_id, audiofile_id);
        this.props.navigation.navigate('Audio', { book_id: audio_book_id, audiofile_id: audiofile_id, book_name: audio_book_name/*, book_src: item.file_src,*/ });
    }
    render() {
        console.log("render state", this.state)
        console.log('READER NORM RENDER');
        console.log("render props", this.props)
        return (
            <View style={styles.container}>
                <Epub style={styles.reader}
                    ref="epub"
                    src={this.state.src}
                    flow={this.state.flow}
                    location={this.state.location}
                    gap={10}
                    themes={this.state.themes}
                    theme={this.state.theme}
                    fontSize={this.state.fontSize + 'px'}
                    onLocationChange={(visibleLocation) => {
                        console.log("locationChanged", visibleLocation)
                        try {
                            // if (visibleLocation.start){
                            // if (visibleLocation.start.location != this.state.visibleLocation.start.location){
                            // }
                            // }
                            this.setState({ visibleLocation });
                            this.setState({
                                current_location_index: visibleLocation.end.location,
                            })
                            this.setState({
                                progress_width: (this.state.current_location_index / this.state.total_locations) * 100
                            })
                            this.saveBookLocation(visibleLocation.start.cfi, this.state.book_id);
                        } catch (e) {
                            console.log('locationChanged failed', e)
                        }
                    }}
                    onLocationsReady={(locations) => {
                        // console.log("location total", locations.total);
                        this.setState({ sliderDisabled: false });
                    }}
                    onReady={(book) => {
                        console.log('onReady fired', book)
                        this.setState({
                            successLoaded: true,
                        });
                        this.checkInitialLocation();
                        // this.defineBookLocations(book);
                        // clearInterval(interval);
                        setTimeout(() => {
                            try {
                                this.setState({
                                    total_locations: book.locations.total
                                });
                                let cached_book_;
                                if (this.props.main.lang == 'eng' || this.props.main.lang == 'en') {
                                    cached_book_ = 'cached_book__eng';
                                } else if (this.props.main.lang == 'es') {
                                    cached_book_ = 'cached_book_es';
                                } else {
                                    cached_book_ = 'cached_book_';
                                }
                                AsyncStorage.setItem(cached_book_ + this.state.book_id, 'true')
                            } catch (e) {
                                console.log(e);
                            }
                        }, 1500);
                    }}
                    onPress={(cfi, position, rendition) => {
                        console.log("press", cfi);

                    }}
                    onLongPress={(cfi, rendition) => {
                        console.log("longpress", cfi);
                    }}
                    onViewAdded={(index) => {
                        console.log("added", index)
                    }}
                    beforeViewRemoved={(index) => {
                        console.log("removed", index)
                    }}
                    onSelected={(cfiRange, rendition) => {
                        console.log("selected", cfiRange)
                        // Add marker
                        rendition.highlight(cfiRange, {});
                    }}
                    onMarkClicked={(cfiRange) => {
                        console.log("mark clicked", cfiRange)
                    }}
                    origin={this.state.origin}
                    onError={(message) => {
                        console.log("EPUBJS-Webview", message);
                    }}
                />
                {!!this.state.total_locations && (
                    <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center', padding: 3, backgroundColor: this.state.theme == 'light' ? '#fff' : '#171717', position: 'absolute', bottom: 0 }}>
                        <View style={{ flex: 1, height: 5 }}>
                            <View style={{ backgroundColor: '#c1ae97', width: this.state.progress_width + '%', height: 5, borderRadius: 5 }}></View>
                        </View>
                        <Text style={{ fontSize: 10, color: this.state.theme == 'light' ? '#000' : '#bebebe' }}>{this.state.current_location_index} из {this.state.total_locations}</Text>
                    </View>
                )}
                {this.state.nav_opened && (
                    <View style={styles.navigation}>
                        <View style={styles.navigation_header}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.setState({ listScreen: 'content' })}>
                                <Text style={{padding: 15, color: this.state.listScreen == 'content' ? 'tomato' : 'black'}}>
                                        {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                                        ? 'Contents'
                                        : this.props.main.lang == 'es'
                                        ? 'Contenido del libro'
                                        : 'Содержание книги'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ listScreen: 'bookmarks' })}>
                                    <Text style={{ padding: 15, color: this.state.listScreen == 'bookmarks' ? 'tomato' : 'black' }}>{this.props.main.lang == 'eng' || this.props.main.lang == 'en' ? 'Bookmarks' : this.props.main.lang == 'es' ? 'Marcadores' : 'Закладки'}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ nav_opened: false })}>
                                <Ionicons style={{ padding: 15 }} name="ios-close-circle-outline" size={25} color="tomato" />
                            </TouchableOpacity>
                        </View>
                        {this.state.listScreen == 'content' ? (
                            <View style={styles.navigation_list}>
                                <FlatList
                                    data={this.state.book_locations}
                                    keyExtractor={item => String(item.id)}
                                    renderItem={({ item }) => (
                                        <View style={styles.navigation_list_row}>
                                            <View style={{ maxWidth: '85%' }}>
                                                <TouchableOpacity onPress={() => this.setState({ location: item.app_href, nav_opened: false })}>
                                                    <View style={{ flex: 1, height: "100%" }}>
                                                        <Text>{item.title.trim()}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            {item.audiofile_id && (
                                                <TouchableOpacity onPress={() => this.redirectToAudio(item.audio_book_id, item.audiofile_id, item.audio_book_name)}>
                                                    <View style={{ flex: 0, alignItems: 'center', marginTop: -10 }}>
                                                        <Ionicons name={"ios-volume-mute"} size={35} color="tomato" style={{ marginTop: 5 }} />
                                                        <Text style={{ fontSize: 10, marginTop: -10, }}>Слушать</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}
                                >
                                </FlatList>
                            </View>
                        ) : (
                                <View style={styles.navigation_list}>
                                    <FlatList
                                        data={this.state.bookmarks}
                                        keyExtractor={item => String(item.location)}
                                        renderItem={({ item }) => (
                                            <View style={styles.navigation_list_row}>
                                                <View style={{ maxWidth: '85%' }}>
                                                    <TouchableOpacity onPress={() => this.setState({ location: item.location, nav_opened: false })}>
                                                        <View style={{ flex: 1, height: "100%" }}>
                                                        <Text>
                                                        {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                                                        ? 'Chapter'
                                                        : this.props.main.lang == 'es'
                                                        ? 'Cabeza'
                                                        : 'Глава'} : {!!item.toc_title ? item.toc_title.trim() : 
                                                        (this.props.main.lang == 'eng' || this.props.main.lang == 'en')
                                                        ? 'Not specified'
                                                        : this.props.main.lang == 'es'
                                                        ? 'No especificado'
                                                        : 'Не указано'}
                                                    </Text>

                                                    <Text>
                                                        {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                                                        ? 'Comment'
                                                        : this.props.main.lang == 'es'
                                                        ? 'Comentar'
                                                        : 'Комментарий'} : {item.comment.trim()}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <TouchableOpacity onPress={() => this.deleteBookmark(item.location)}>
                                                    <View style={{ flex: 0, alignItems: 'center', marginTop: -10 }}>
                                                        <Ionicons name={"ios-trash"} size={25} color="tomato" style={{ marginTop: 5 }} />
                                                        <Text style={{fontSize: 10, marginTop: -6,}}>{this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                                                        ? 'Delte'
                                                        : this.props.main.lang == 'es'
                                                        ? 'Quitar'
                                                        : 'Удалить'}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    >
                                    </FlatList>
                                </View>
                            )}
                    </View>
                )}
                {this.state.settingsOpened && (
                    <View style={styles.navigation}>
                        <View style={styles.navigation_header}>
                            <Text style={{ padding: 15 }}>
                                {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                                ? 'Settings'
                                : this.props.main.lang == 'es'
                                ? 'Ajustes'
                                : 'Настройки'}
                            </Text>
                            <TouchableOpacity onPress={() => this.setState({ settingsOpened: false })}>
                                <Ionicons style={{ padding: 15 }} name="ios-close-circle-outline" size={25} color="tomato" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ padding: 15 }}>
                            {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                            ? 'Color theme'
                            : this.props.main.lang == 'es'
                            ? 'Modo de lectura'
                            : 'Режим чтения'}
                        </Text>
                        <View style={styles.setting_themes}>
                            <TouchableOpacity onPress={() => this.setTheme('light')} style={{ marginRight: 15 }}>
                                <View style={this.state.theme == 'light' ? styles.active_theme : styles.non_active_theme}>
                                    <Ionicons color="#75644f" name={"ios-sunny"} size={30} />
                                    <Text>
                                        {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                                        ? 'Day'
                                        : this.props.main.lang == 'es'
                                        ? 'El dia'
                                        : 'День'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setTheme('dark')} >
                                <View style={this.state.theme == 'dark' ? styles.active_theme : styles.non_active_theme}>
                                    <Ionicons color="#75644f" name={"ios-moon"} size={30} />
                                    <Text>
                                        {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                                        ? 'Night'
                                        : this.props.main.lang == 'es'
                                        ? 'La noche'
                                        : 'Ночь'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ padding: 15 }}>
                            {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                            ? 'Font size'
                            : this.props.main.lang == 'es'
                            ? 'Tamaño de fuente'
                            : 'Размер текста'}
                        </Text>
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <Slider
                                step={1}
                                maximumValue={25}
                                minimumValue={10}
                                value={this.state.fontSize}
                                onValueChange={val => this.setState({ fontSize: val })}
                            />
                        </View>
                        <Text style={{padding: 15, textAlign: 'center', fontSize: this.state.fontSize}}>
                            {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                            ? 'Text example'
                            : this.props.main.lang == 'es'
                            ? 'Texto de muestra'
                            : 'Пример текста'} {' '}
                            ({this.state.fontSize} px)
                        </Text>
                    </View>
                )}
                <View>
                    <Dialog.Container visible={this.state.bookmarksDialogVisible}>
                    <Dialog.Title>
                        {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                        ? 'Add bookmark'
                        : this.props.main.lang == 'es'
                        ? 'Añadir marcador'
                        : 'Добавить закладку'}
                    </Dialog.Title>
                    <Dialog.Description>
                        {this.props.main.lang == 'eng' || this.props.main.lang == 'en'
                        ? 'Please enter a comment for the bookmark'
                        : this.props.main.lang == 'es'
                        ? 'Por favor, introduzca un comentario para el marcador'
                        : 'Пожалуйста, введите комментарий к закладке'}
                    </Dialog.Description>
                        <Dialog.Input onChangeText={value => this.setState({ bookmarksDialogComment: value })}></Dialog.Input>
                        <Dialog.Button onPress={() => this.setState({ bookmarksDialogVisible: false, bookmarksDialogComment: '' })} label={this.props.main.lang == 'eng' || this.props.main.lang == 'en' ? 'Cancel' : this.props.main.lang == 'es' ? 'Cancelar' : 'Отменить'} />
                        <Dialog.Button onPress={() => this.addBookmark()} label={this.props.main.lang == 'eng' || this.props.main.lang == 'en' ? 'Save' : this.props.main.lang == 'es' ? 'Guardar' : 'Сохранить'} />
                    </Dialog.Container>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    reader: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: '#3F3F3C'
    },
    bar: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 55
    },
    navigation: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        flex: 1,
        backgroundColor: "#fff",
        height: "100%"
    },
    navigation_header: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea"
        // padding: 15,
    },
    navigation_list: {
        paddingBottom: 58
    },
    navigation_list_row: {
        padding: 10,
        paddingLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    setting_themes: {
        flex: 0,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
    },
    active_theme: {
        width: 90,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#c1ae97",
        borderRadius: 5,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.1,
    },
    non_active_theme: {
        width: 90,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#bebebe",
        borderRadius: 5,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.1,
    }
});

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
const connectedElem = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReaderScreenDetail); 
connectedElem.navigationOptions = ({ navigation }) => {
    console.log('NAVIGATION OPTIONS FIRED')
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
export default connectedElem;