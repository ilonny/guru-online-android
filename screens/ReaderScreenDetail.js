import ReaderScreenDetailContainer from "./ReaderScreenDetailContainer"
import React, { Component } from "react";
export default class ReaderScreenDetails extends Component {
    render(){
        return <ReaderScreenDetailContainer navigation={this.props.navigation}/>
    }
}