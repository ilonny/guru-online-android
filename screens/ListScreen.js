import ListScreenContainer from "./ListScreenContainer"
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
    ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from "../constants/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import { listStyles } from "../constants/list_styles";
import { connect } from "react-redux";
import Pagination,{Icon,Dot} from 'react-native-pagination';//{Icon,Dot} also available

export default class ListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            storage: [],
            authors: [],
            quotes: [],
            quotes_all: [],
            test: "",
            k: 0,
            test2: "",
            date: Date.now(),
            refreshnig: false,
            online: true,
            pages_count: 0,
            current_page: 1,
            modalIsOpen: true,
            queue: false
        };
    }
    static navigationOptions = ({ navigation }) => {
        const toggleSettings = navigation.getParam('toggleSettings');
        return {
            // title: "Цитаты",
            headerLeft: (
                // <TouchableOpacity onPress={navigation.getParam('consoleState')}>
                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => toggleSettings()}>
                        <Ionicons name={"ios-more"} size={30} color={'tomato'} style={{marginTop: 5, marginLeft: 15}}/>
                    </TouchableOpacity>
                </View>
            ),
            headerRight: (
                // <TouchableOpacity onPress={navigation.getParam('consoleState')}>
                <View
                    style={{
                        alignItems: "center",
                        flex: 1,
                        flexDirection: "row"
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Favorites")}
                    >
                        <Ionicons
                            name={"ios-star"}
                            size={30}
                            color={"tomato"}
                            style={{ marginTop: 5, marginRight: 15 }}
                        />
                    </TouchableOpacity>
                </View>
            )
        };
    };
    render(){
        return <ListScreenContainer navigation={this.props.navigation}/>
    }
}