import SiteScreenDetailContainer from "./SiteScreenDetailContainer"
import React, { Component } from "react";
export default class SiteScreenDetail extends Component {
    render(){
        return <SiteScreenDetailContainer navigation={this.props.navigation}/>
    }
}