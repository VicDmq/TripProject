import React, { Component } from "react";
import { View, Text } from "@shoutem/ui";

import NavBarComponent from "../Components/NavBar";

export default class UsersDatasScreen extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<NavBarComponent title={"Données voyages"} logoutButton={true} />
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
					<Text>Ceci est l'écran des données</Text>
				</View>
			</View>
		);
	}
}
