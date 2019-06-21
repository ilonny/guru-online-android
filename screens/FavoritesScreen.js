import FavoritesScreenContainer from "./FavoritesScreenContainer"
import React, { Component } from "react";
export default class ListScreen extends Component {
    render(){
        return <FavoritesScreenContainer navigation={this.props.navigation}/>
    }
}