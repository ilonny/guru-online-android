import React, { Component } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { listStyles } from "../constants/list_styles";
import { SafeAreaView } from "react-navigation";

import { connect } from "react-redux";
class AudioScreenRouterContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            date: Date.now(),
            refreshnig: false,
            online: true,
            loading: false
        };
    }
    static navigationOptions = ({ navigation }) => {
        const dim = Dimensions.get("window");
        return {
            headerStyle:
                dim.height == 812 ||
                dim.width == 812 ||
                dim.height == 896 ||
                dim.width == 896
                    ? {
                          height: 65
                      }
                    : {}
        };
    };
    render() {
        return (
            // <SafeAreaView style={{ flex: 1, backgroundColor: "#F5FCFF" }}>
            <SafeAreaView>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Аудиокниги")}>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#fff", padding: 10, borderRadius: 10, marginTop: 5, marginBottom: 5}]}>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons
                                name="ios-headset"
                                size={30}
                                color="#75644f"
                                />
                            <Text style={listStyles.quoteTitle}>{this.props.main.lang == 'ru' ? 'Аудиокниги' : 'Audiobooks'}</Text>
                        </View>
                        <View style={listStyles.arrowCircle}>
                            <View style={listStyles.arrowCircleInside}>
                            <Ionicons name="ios-arrow-forward" size={40} color="#fff"/>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {console.log('navigate here'); this.props.navigation.navigate("AudioArchiveAuthors")}}>
                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#fff", padding: 10, borderRadius: 10, marginTop: 5, marginBottom: 5}]}>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons
                                name="ios-headset"
                                size={30}
                                color="#75644f"
                                />
                            <Text style={listStyles.quoteTitle}>{this.props.main.lang == 'ru' ? 'Архив аудио' : 'Audio archive'}</Text>
                        </View>
                        <View style={listStyles.arrowCircle}>
                            <View style={listStyles.arrowCircleInside}>
                            <Ionicons name="ios-arrow-forward" size={40} color="#fff"/>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    row: {
    }
})

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
  )(AudioScreenRouterContainer); 