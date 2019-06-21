import ReaderScreenContainer from "./ReaderScreenContainer"
import React, { Component } from "react";
export default class ReaderScreen extends Component {
    render(){
        return <ReaderScreenContainer navigation={this.props.navigation}/>
    }
}