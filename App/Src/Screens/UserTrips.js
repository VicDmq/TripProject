import React, { Component } from "react";
import { View, Text } from "@shoutem/ui";

import NavBarComponent from "../Components/NavBar";

export default class UserTripsScreen extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<NavBarComponent title={"Mes voyages"} logoutButton={true} />
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
					<Text>Ceci est l'écran de voyage</Text>
				</View>
			</View>
		);
	}
}
