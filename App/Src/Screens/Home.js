import React, { Component } from "react";
import { Text, View, Button } from "@shoutem/ui";
import Icon from "react-native-vector-icons/FontAwesome";

import SpinnerComponent from "../Components/Spinner";
import NabBarComponent from "../Components/NavBar";

import { getConnectedUser, removeConnectedUser } from "../../DataAccess/ObjectsRepositories/UserRepository";

export default class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: undefined,
			test: undefined
		};
		this.setUser();
	}

	setUser = async () => {
		const user = await getConnectedUser();
		this.setState({ user: user });
		this.setState({ test: this.props.screenProps });
	};

	render() {
		if (this.state.user == undefined) {
			return <SpinnerComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<NabBarComponent title={"Accueil"} logoutButton={true} />
					<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
						<Text>Hey Home {this.state.user.lastName}!</Text>
						<Icon name="ios-information-circle-outline" size={30} color="#900" />
					</View>
				</View>
			);
		}
	}
}
