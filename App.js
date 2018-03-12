import React, { Component } from "react";
// import { Platform, StyleSheet, Text, View } from "react-native";
import { FlatList, ActivityIndicator, Text, View } from "react-native";
import { Examples } from "@shoutem/ui";
const Realm = require("realm");
import { realm } from "./DataAccess/Database/Realm";

// import { createDatabase } from "./DataAccess/Scripts/CreateDatabase";
import { addUser, updateUser } from "./DataAccess/ObjectsRepository/UserRepository";
import { addCountry } from "./DataAccess/ObjectsRepository/CountryRepository";
import { addCurrency, createCurrencies } from "./DataAccess/ObjectsRepository/CurrencyRepository";
import { getRateFromBase, test } from "./Api/Fixer";

export default class App extends Component {
	constructor(props) {
		super(props);
		// createDatabase();
		this.state = {
			realm: realm
		};
	}

	componentDidMount() {}

	render() {
		return <Examples />;
	}
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "#F5FCFF"
// 	},
// 	welcome: {
// 		fontSize: 20,
// 		textAlign: "center",
// 		margin: 10
// 	},
// 	instructions: {
// 		textAlign: "center",
// 		color: "#333333",
// 		marginBottom: 5
// 	}
// });
