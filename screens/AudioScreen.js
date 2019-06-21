import AudioScreenContainer from "./AudioScreenContainer"
import React, { Component } from "react";
export default class AudioScreen extends Component {
    render(){
        return <AudioScreenContainer navigation={this.props.navigation}/>
    }
}