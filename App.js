import React, { Component } from "react";
// import { Platform, StyleSheet, Text, View } from "react-native";
import { FlatList, ActivityIndicator, Text, View } from "react-native";
import { Examples } from "@shoutem/ui";
const Realm = require("realm");
import { realm } from "./DataAccess/Database/Realm";

// import { createDatabase } from "./DataAccess/Scripts/CreateDatabase";
import { addUser, updateUser } from "./DataAccess/ObjectsRepository/UserRepository";
import { addCountry } from "./DataAccess/ObjectsRepository/CountryRepository";
import { addCurrency, convert } from "./DataAccess/ObjectsRepository/CurrencyRepository";
import { getRateFromBase, test } from "./Api/Fixer";

export default class App extends Component {
	constructor(props) {
		super(props);
		// createDatabase();
		const createCurrency = async () => {
			const dollar = await addCurrency("Dollar", "USD");
			console.log(dollar);
		};
		createCurrency();
		// const dollars = addCurrency("Dollar", "USD");
		// const usa = addCountry("USA", dollars);
		// const user = addUser("dmq", "vic", "Domecq", "Victor", usa);
		// updateUser(user, user.login, user.password, user.lastName, "Dominique");
		this.state = {
			realm: realm
		};
	}

	componentDidMount() {}

	render() {
		// length = this.state.realm.objects("User").length;
		// console.log(this.state.realm.objects("User")[length - 1]);
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
