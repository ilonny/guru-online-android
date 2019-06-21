import AudioDetailContainer from "./AudioDetailContainer"
import React, { Component } from "react";
export default class AudioScreenDetail extends Component {
    render(){
        return <AudioDetailContainer navigation={this.props.navigation}/>
    }
}