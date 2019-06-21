import DetailsScreenContainer from "./DetailsScreenContainer"
import React, { Component } from "react";
export default class DetailsScreen extends Component {
    render(){
        return <DetailsScreenContainer navigation={this.props.navigation}/>
    }
}