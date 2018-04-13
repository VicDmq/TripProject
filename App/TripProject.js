import React, { Component, YellowBox } from "react";
console.disableYellowBox = true;

import { createData } from "./DataAccess/Scripts/createData";

import { Navigation } from "./Src/Navigation";

import { StyleProvider } from "@shoutem/theme";
import { theme } from "./Src/Theme";
import { createCountryFromRestCountries } from "./DataAccess/ObjectsRepositories/CountryRepository";
import { updateUser, getConnectedUser } from "./DataAccess/ObjectsRepositories/UserRepository";
import { getObjects } from "./DataAccess/Scripts/Requests";

export default class App extends Component {
	constructor(props) {
		super(props);
		// createData();
		// createCountryFromRestCountries();
	}

	render() {
		return (
			<StyleProvider style={theme}>
				<Navigation />
			</StyleProvider>
		);
	}
}
