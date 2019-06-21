import AudioArchiveAudioScreenContainer from "./AudioArchiveAudioScreenContainer"
import React, { Component } from "react";
export default class AudioArchiveAudioScreen extends Component {
    render(){
        return <AudioArchiveAudioScreenContainer navigation={this.props.navigation}/>
    }
}