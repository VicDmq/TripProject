import React, { Component } from "react";
import { Text, View, Button, ActivityIndicator } from "react-native";
//import { Screen, Button } from "@shoutem/ui";

import { getUserConnected } from "../../DataAccess/ObjectsRepositories/UserRepository";

export default class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: undefined
		};
		this.setUserConnected();
	}

	setUserConnected = async () => {
		const user = await getUserConnected();
		console.log(user);
		this.setState({ user: user });
	};

	render() {
		if (this.state.user == undefined) {
			//Changer !
			return <ActivityIndicator />;
		} else {
			return (
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
					<Text>Hey Home {this.state.user.lastName}!</Text>
					<Button
						title="Go to Account"
						onPress={() => this.props.navigation.navigate("Account", { login: this.state.user.login })}
					/>
					<Button title="Disconnect" onPress={() => this.props.navigation.navigate("SignIn")} />
				</View>
			);
		}
	}
}
