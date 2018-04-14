import React, { Component } from "react";
import { View, NavigationBar, ImageBackground, Heading } from "@shoutem/ui";

import BackButtonComponent from "./BackButton";
import LogOutButtonComponent from "./LogOutButton";

export default class NavBarComponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ImageBackground source={require("../Images/road.jpg")} style={{ width: 375, height: 70 }}>
				<NavigationBar
					styleName="clear"
					leftComponent={this.props.backButton ? <BackButtonComponent /> : null}
					centerComponent={
						<Heading styleName="bold h-center" style={{ width: 250 }}>
							{this.props.title}
						</Heading>
					}
					rightComponent={this.props.logoutButton ? <LogOutButtonComponent /> : null}
				/>
			</ImageBackground>
		);
	}
}
