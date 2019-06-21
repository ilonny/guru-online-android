import ListScreenContainer from "./ListScreenContainer"
import React, { Component } from "react";
export default class ListScreen extends Component {
    render(){
        return <ListScreenContainer navigation={this.props.navigation}/>
    }
}