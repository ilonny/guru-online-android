import NotificationScreenContainer from "./NotificationScreenContainer"
import React, { Component } from "react";
export default class DetailsScreen extends Component {
    render(){
        return <NotificationScreenContainer navigation={this.props.navigation}/>
    }
}