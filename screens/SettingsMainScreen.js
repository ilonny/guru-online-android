import SettingsMainScreenContainer from "./SettingsMainScreenContainer"
import React, { Component } from "react";
export default class SettingsMainScreen extends Component {
    render(){
        return <SettingsMainScreenContainer navigation={this.props.navigation}/>
    }
}