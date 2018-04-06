import React, { Component } from "react";
import { Text, View, Button } from "react-native";
//import { Screen } from "@shoutem/ui";

export default class UserAccountScreen extends Component {
	constructor(props) {
		super(props);
		const { params } = this.props.navigation.state;
		this.state = {
			login: params.login
		};
	}

	render() {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Text>{this.state.login}</Text>
				<Text>Hey Account ! </Text>
				<Button title="Go to Home" onPress={() => this.props.navigation.goBack()} />
			</View>
		);
	}
}
