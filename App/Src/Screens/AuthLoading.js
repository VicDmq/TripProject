import React, { Component } from "react";
import SpinnerComponent from "../Components/Spinner";

import { getConnectedUser } from "../../DataAccess/ObjectsRepositories/UserRepository";

export default class AuthLoadingScreen extends React.Component {
	constructor() {
		super();
		this.checkIfUserIsConnected();
	}

	checkIfUserIsConnected = async () => {
		const user = await getConnectedUser();
		this.props.navigation.navigate(user ? "App" : "Auth");
	};

	render() {
		return <SpinnerComponent />;
	}
}
