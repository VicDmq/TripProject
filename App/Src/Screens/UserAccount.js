import React, { Component } from "react";
import { Text, View, Button } from "@shoutem/ui";

import SpinnerComponent from "../Components/Spinner";
import NavBarComponent from "../Components/NavBar";

import { getConnectedUser } from "../../DataAccess/ObjectsRepositories/UserRepository";

export default class UserAccountScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: undefined
		};
		this.setUser();
	}

	setUser = async () => {
		const user = await getConnectedUser();
		this.setState({ user: user });
	};

	render() {
		if (this.state.user == undefined) {
			return <SpinnerComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<NavBarComponent title={"Compte"} logoutButton={true} />
				</View>
			);
		}
	}
}
