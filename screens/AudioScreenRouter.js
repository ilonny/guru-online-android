import AudioScreenRouterContainer from "./AudioScreenRouterContainer"
import React, { Component } from "react";
export default class AudioScreenRouter extends Component {
    render(){
        return <AudioScreenRouterContainer navigation={this.props.navigation}/>
    }
}