import React, { Component } from "react";
import { Text, View, Button, AsyncStorage } from "react-native";

import { getObjectsFiltered } from "../../DataAccess/Scripts/Requests";

//import { Screen, Button } from "@shoutem/ui";

export default class SignInScreen extends Component {
	constructor(props) {
		super(props);
	}

	logIn = async (login, password) => {
		const request = "login ='" + login + "' AND password='" + password + "'";
		const user = getObjectsFiltered("User", request)[0];
		if (user != undefined) {
			await AsyncStorage.setItem("userLogin", login);
			await AsyncStorage.setItem("userPassword", password);
			this.props.navigation.navigate("Home");
		} else {
			//TODO
		}
	};

	render() {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Text>Bienvenue !</Text>
				<Button title="Connect" onPress={() => this.logIn("vicID", "vicPWD")} />
			</View>
		);
	}
}
