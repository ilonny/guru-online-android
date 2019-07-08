import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SectionList,
    Switch,
    ScrollView,
    TouchableOpacity,
    Linking,
    Picker
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from "react-navigation";
import { setLang } from "../actions/lang";
import { connect } from "react-redux";
import { listStyles } from "../constants/list_styles";
import {ecadashCityList} from '../constants/ecadash'
import {API_URL} from '../constants/api'

class SettingsCityScreen extends Component {
    state = {
        ecadashCityChosen: '',
        ecadashCityList: ecadashCityList,
        token: '',
        ecadashCategory: [],
    }
    componentDidMount(){
        AsyncStorage.getItem('ecadash_city_chosen', (err, value) => {
            if (!value) {
                value = 'moscow';
            }
            this.setState({
                ecadashCityChosen: value
            });
        })
        AsyncStorage.getItem('Token', (err, token) =>{
            if (token) {
                this.setState({
                    token: token
                });
            } else {
                console.log('lolll')
            }
        })
        AsyncStorage.getItem('ecadash_category', (err, value) => {
            if (!value) {
                value = '["holy", "ecadash"]';
            }
            try {
                this.setState({
                    ecadashCategory: JSON.parse(value),
                })
            } catch (e) {
                console.log('crash', e)
            }
        })
    }
    switchToggle(name){
        if (this.state.ecadashCategory.includes(name)) {
            let arr = [...this.state.ecadashCategory];
            let index = arr.indexOf(name);
            arr.splice(index, 1);
            this.setState({
                ecadashCategory: arr
            });
        } else {
            this.setState({
                ecadashCategory: this.state.ecadashCategory.concat(name)
            });
        }
        console.log('swittch', name)
        setTimeout(() => {
            this.updateTokenSetting();
            AsyncStorage.setItem('ecadash_category', JSON.stringify(this.state.ecadashCategory));
        }, 150);
    }
    updateTokenSetting() {
        let request = new XMLHttpRequest();
        request.onreadystatechange = e => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
            }
        };
        request.open(
            "GET",
            API_URL +
                `/set-token?token=${this.state.token}&settings=old&news_settings=old&version=3&ecadash=old&ecadash=${JSON.stringify(this.state.ecadashCategory)}`
        );
        request.send();
        console.log(
            "updateTokenCity",
            API_URL +
                `/set-token?token=${this.state.token}&settings=old&news_settings=old&version=3&ecadash=old&ecadash=${JSON.stringify(this.state.ecadashCategory)}`
        );
    }
    render() {
        return (
            <SafeAreaView   style={{ flex: 1, backgroundColor: "#efefef" }}>
                <View style={styles.container}>
                    <ScrollView>
                        <View
                            style={[
                                listStyles.quoteItem,
                                {
                                    marginLeft: 10,
                                    marginRight: 10,
                                    marginTop: 10
                                }
                            ]}
                        >
                            <Text
                                style={{
                                    color: "#808080",
                                    textAlign: "center"
                                }}
                            >
                                {this.props.main.lang == "en" ||
                                this.props.main.lang == "eng"
                                    ? "Please select your city and category to receive notifications about Ekadashi and holidays:"
                                    : this.props.main.lang == "es"
                                    ? "Please select your city and category to receive notifications about Ekadashi and holidays:"
                                    : "Пожалуйста, выберите свой город и категории для получения уведомлений об экадаши и праздниках:"}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: 20
                                }}
                            >
                                <Picker
                                    selectedValue={this.state.ecadashCityChosen}
                                    style={{height: 50, width: 250}}
                                    onValueChange={itemValue => {
                                        this.setState({ecadashCityChosen: itemValue});
                                        AsyncStorage.setItem('ecadash_city_chosen', itemValue);
                                        let request = new XMLHttpRequest();
                                        request.onreadystatechange = (e) => {
                                            if (request.readyState !== 4) {
                                                return;
                                            }
                                            if (request.status === 200) {
                                                
                                            }
                                        };
                                        setTimeout(() => {
                                            request.open('GET', API_URL + `/set-ecadash-city?token=${this.state.token}&city=${this.state.ecadashCityChosen}`);
                                            request.send();
                                        }, 250);
                                    }}
                                >
                                    {this.state.ecadashCityList.map(city => (
                                        <Picker.Item key={city.name_link} label={this.props.main.lang == 'ru' ? city.name : city.name_eng} value={city.name_link} />
                                    ))}
                                </Picker>
                            </View>
                                <View style={[listStyles.quoteItem, {marginTop: -5, borderRadius: 0, shadowRadius: 0, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}]}>
                                    <View style={{maxWidth: '80%'}}>
                                        <Text style={{fontWeight: 'bold'}}>Праздники</Text>
                                    </View>
                                    <Switch value={this.state.ecadashCategory.includes('holy') ? true : false}  onValueChange={() => this.switchToggle('holy')} />
                                </View>
                                <View style={[listStyles.quoteItem, {marginTop: -5, borderRadius: 0, shadowRadius: 0, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}]}>
                                    <View style={{maxWidth: '80%'}}>
                                        <Text style={{fontWeight: 'bold'}}>Экадаши</Text>
                                    </View>
                                    <Switch value={this.state.ecadashCategory.includes('ecadash') ? true : false}  onValueChange={() => this.switchToggle('ecadash')} />
                                </View>
                        </View>
                        <View
                            style={[
                                listStyles.quoteItem,
                                {
                                    marginLeft: 10,
                                    marginRight: 10,
                                    marginTop: 10
                                }
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() =>
                                    Linking.openURL("mailto:7782810@mail.ru")
                                }
                            >
                                <Text
                                    style={{
                                        color: "#808080",
                                        textAlign: "center"
                                    }}
                                >
                                    {this.props.main.lang == "en" ||
                                    this.props.main.lang == "eng"
                                        ? `Contact us: \n 7782810@mail.ru`
                                        : this.props.main.lang == "es" ? "Contáctenos: \n 7782810@mail.ru"
                                        : `Напишите нам: \n 7782810@mail.ru`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
const mapStateToProps = state => {
    return {
        main: state.mainReducer
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setLang: lang => dispatch(setLang(lang))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsCityScreen);

const styles = StyleSheet.create({});