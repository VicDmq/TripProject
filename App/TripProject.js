import React, { Component, YellowBox } from "react";
console.disableYellowBox = true;

import { createData } from "./DataAccess/Scripts/createData";

import { Navigation } from "./Src/Navigation";

import { StyleProvider } from "@shoutem/theme";
import { theme } from "./Src/Theme";

export default class App extends Component {
	constructor(props) {
		super(props);
		// createData();
	}

	render() {
		return (
			<StyleProvider style={theme}>
				<Navigation />
			</StyleProvider>
		);
	}
}
