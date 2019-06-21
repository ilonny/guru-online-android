import SiteScreenContainer from "./SiteScreenContainer"
import React, { Component } from "react";
export default class SiteScreen extends Component {
    static navigationOptions = {
        header: null
    };
    render(){
        return <SiteScreenContainer navigation={this.props.navigation}/>
    }
}