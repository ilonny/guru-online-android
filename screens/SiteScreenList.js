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
    TextInput,
    Image,
    ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from "react-redux";
import { listStyles } from "../constants/list_styles";
import { getItems, setTag } from "../actions/site";
import NavigationService from "../NavigationService";

class SiteScreenList extends Component {
    static navigationOptions = {
        header: null
    };
    state = {
        page: 1,
        q_str: ""
    };
    _renderItem = ({ item }) => {
        // console.log("render item..");
        if (item.type != "end") {
            return (
                <TouchableOpacity
                    onPress={() => {
                        NavigationService.navigate("SiteDetail", {
                            id: item.ID,
                            title: item.NAME
                        });
                    }}
                >
                    <View style={[listStyles.quoteItem]}>
                        <View
                            style={[
                                listStyles.quoteBottom,
                                { marginTop: 0, justifyContent: "flex-start" }
                            ]}
                        >
                            <Image
                                style={{
                                    width: 68,
                                    height: 68,
                                    marginRight: 10,
                                    borderRadius: 10
                                }}
                                source={{ uri: item.PREVIEW_PICTURE_SRC }}
                            />
                            <Text
                                style={[
                                    listStyles.quoteTitle,
                                    { maxWidth: "75%" }
                                ]}
                            >
                                {item.NAME}
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: "#c5c5c5",
                                fontStyle: "italic",
                                textAlign: "right"
                            }}
                        >
                            {item.DATE_TEXT}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={[listStyles.quoteItem, {}]}
                    onPress={() => this.addPage()}
                >
                    <Text
                        style={{
                            color: "#c5c5c5",
                            fontStyle: "italic",
                            textAlign: "center"
                        }}
                    >
                        Загрузить еще
                    </Text>
                </TouchableOpacity>
            );
        }
    };
    _onEndReached = () => {
        // console.log("_onEndReached fired");
        this.setState({
            page: this.state.page + 1
        });
        setTimeout(() => {
            this.props.getItems(
                this.props.type,
                this.state.page,
                "",
                "add",
                this.props.site.tag
            );
        }, 100);
    };
    _keyExtractor = item => {
        return item.NAME + item.ID;
    };
    componentDidMount() {
        this.props.getItems(
            this.props.type,
            this.state.page,
            "",
            "replace",
            this.props.site.tag
        );
    }
    addPage() {
        this.setState({
            page: this.state.page + 1
        });
        setTimeout(() => {
            this.props.getItems(
                this.props.type,
                this.state.page,
                this.state.q_str,
                "add",
                this.props.site.tag
            );
        }, 100);
    }
    changeSearchText(text) {
        // let timer;
        // clearTimeout(timer);
        // timer = setTimeout(function() {
        //     // console.log('changeSearchText', text);
        // }, 200);
        this.setState({
            q_str: text,
            page: 1
        });
        setTimeout(() => {
            this.props.getItems(
                this.props.type,
                this.state.page,
                this.state.q_str,
                "replace",
                this.props.site.tag
            );
        }, 100);
    }
    // refresh(){
    //     this.setState({
    //         refreshing: true
    //     });
    //     this.props.getItems(this.props.type, this.state.page, "", "replace", this.props.site.tag);
    // }
    componentDidUpdate(prevProps) {
        // console.log('componentDidUpdate', prevProps, this.props);
        if (prevProps.site.tag != this.props.site.tag) {
            this.props.getItems(
                this.props.type,
                this.state.page,
                "",
                "replace",
                this.props.site.tag
            );
        }
    }
    render() {
        // console.log("site screen detail props: ", this.props);
        // console.log("site screen detail state: ", this.state);
        let items = [];
        try {
            switch (this.props.type) {
                case "read":
                    items = this.props.site.read.items;
                    break;
                case "content":
                    items = this.props.site.content.items;
                    break;
                case "look":
                    items = this.props.site.look.items;
                    break;
                case "listen":
                    items = this.props.site.listen.items;
                    break;
                case "important":
                    items = this.props.site.important.items;
                    break;
            }
        } catch (e) {
            // console.log("crash", e);
        }
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: "#efefef"
                }}
            >
                <View
                    style={[
                        listStyles.quoteItem,
                        {
                            marginLeft: 0,
                            marginRight: 0,
                            marginBottom: 5,
                            marginTop: 5,
                            flex: 0,
                            padding: 8
                        }
                    ]}
                >
                    {!this.props.site.tag ? (
                        <TextInput
                            placeholder="Поиск"
                            onChangeText={text => this.changeSearchText(text)}
                        />
                    ) : (
                        <View>
                            <Text style={{ textAlign: "center" }}>
                                Публикации по теме: {this.props.site.tag.title}.
                            </Text>
                            <TouchableOpacity
                                onPress={() => this.props.setTag(false)}
                                style={{ padding: 5 }}
                            >
                                <Text style={{ textAlign: "center" }}>
                                    Отменить фильтр
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {items.length == 0 ? (
                    <View
                        style={[
                            listStyles.quoteItem,
                            {
                                marginLeft: 0,
                                marginRight: 0,
                                marginBottom: 5,
                                marginTop: 5,
                                flex: 1,
                                padding: 8
                            }
                        ]}
                    >
                        <ActivityIndicator />
                    </View>
                ) : items.length > 1 ? (
                    <FlatList
                        style={{
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingBottom: 15,
                            paddingTop: 5,
                            flex: 0
                        }}
                        data={items}
                        renderItem={this._renderItem}
                        // onEndReached={this._onEndReached}
                        // onEndReachedThreshold={.7}
                        keyExtractor={this._keyExtractor}
                        refreshing={this.props.refreshing}
                        onRefresh={() => {
                            this.setState({ page: 1 });
                            this.props.getItems(
                                this.props.type,
                                1,
                                "",
                                "replace",
                                this.props.site.tag
                            );
                        }}
                    />
                ) : (
                    <View
                        style={[
                            listStyles.quoteItem,
                            {
                                marginLeft: 10,
                                marginRight: 10,
                                marginBottom: 5,
                                marginTop: 5,
                                flex: 1,
                                padding: 8,
                                alignItems: "center",
                                justifyContent: "center"
                            }
                        ]}
                    >
                        <Text style={{ textAlign: "center" }}>
                            Ничего не найдено :({"\n"}Попробуйте изменить
                            параметры поиска
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
const mapStateToProps = state => {
    return {
        site: state.siteReducer,
        refreshing: state.siteReducer.refreshing
    };
};
const mapDispatchToProps = dispatch => {
    return {
        getItems: (type, offset, q_str, action_type, tag) =>
            dispatch(getItems(type, offset, q_str, action_type, tag)),
        setTag: tag => dispatch(setTag(tag))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SiteScreenList);
