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
    Animated
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import SettingsScreen from "./SettingsScreen";
import SettingsSite from "./SettingsSite";
import SettingsLangScreen from "./SettingsLangScreen";
import SettingsCityScreen from "./SettingsCityScreen";

import { connect } from "react-redux";
const SettingsRoute = () => <SettingsScreen />;
const SettingsSiteRoute = () => <SettingsSite />;
const SettingsLangRoute = () => <SettingsLangScreen />;
const SettingsCityRoute = () => <SettingsCityScreen />;

class SettingsMainScreenContainer extends Component {
    static navigationOptions = {
        header: null
    };
    state = {
        index: 0,
        routes: this.props.main.lang == 'en' || this.props.main.lang == 'eng' ? [
            { key: "settingsCity", title: "City"},
            { key: "settings", title: "Daily quotes"},
            { key: "settingsLang", title: "Language"},
        ] : this.props.main.lang == 'es' ? [
            { key: "settingsCity", title: "Ciudad"},
            { key: "settings", title: "Cotizaciones diarias"},
            { key: "settingsLang", title: "Idioma"},
        ] : [
            { key: "settingsCity", title: "Город"},
            { key: "settings", title: "Ежедневная рассылка цитат"},
            { key: "settingsSite", title: "Разделы сайта harekrisha.ru" },
            { key: "settingsLang", title: "Язык приложения"},
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
            <Text
                style={[styles.label, { textAlign: 'center' }]}
                numberOfLines={2}
            // numberOfLines={route.route.title == 'Вайшнавский календарь' ? 2 : 1}
            // ellipsizeMode='tail'
            >
                {route.route.title}
            </Text>
        );
    };
    _renderScene = SceneMap({
        settings: SettingsRoute,
        settingsSite: SettingsSiteRoute,
        settingsLang: SettingsLangRoute,
        settingsCity: SettingsCityRoute,
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
)(SettingsMainScreenContainer);
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabbar: {
        paddingTop: 0,
        backgroundColor: "#f7f7f7"
    },
    tab: {
        width: 200,
        // flex: 1,
    },
    indicator: {
        backgroundColor: "#75644f"
    },
    label: {
        color: "#75644f",
        fontWeight: "400",
        padding: 0,
        textAlign: 'center',
        fontSize: 13
        // flex: 1,
    }
});