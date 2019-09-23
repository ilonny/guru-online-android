import ArchiveAuthorsListScreenContainer from "./ArchiveAuthorsListScreenContainer"
import React, { Component } from "react";
export default class ArchiveAuthorsListScreen extends Component {
    render(){
        return <ArchiveAuthorsListScreenContainer navigation={this.props.navigation}/>
    }
}