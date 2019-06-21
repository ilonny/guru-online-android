import SettingsScreenContainer from "./SettingsScreenContainer"
import React, { Component } from "react";
export default class SettingsScreen extends Component {
    render(){
        return <SettingsScreenContainer navigation={this.props.navigation}/>
    }
}