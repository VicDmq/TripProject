import React, { Component, YellowBox } from "react";
import { View, Text, Button } from "react-native";
console.disableYellowBox = true;

import { createData } from "./DataAccess/Scripts/createData";

import { StackNavigator, TabNavigator, TabBarBottom, SwitchNavigator } from "react-navigation";

import HomeScreen from "./Src/Screens/Home";
import UserAccountScreen from "./Src/Screens/UserAccount";
import SignInScreen from "./Src/Screens/SignIn";

const AuthStack = StackNavigator({
	SignIn: { screen: SignInScreen }
});

const AppNavigator = TabNavigator(
	{
		Home: { screen: HomeScreen },
		Account: { screen: UserAccountScreen }
	},
	{
		initialRouteName: "Home",
		tabBarComponent: TabBarBottom,
		tabBarPosition: "bottom"
	}
);

const SwitchNav = SwitchNavigator(
	{
		Auth: AuthStack,
		App: AppNavigator
	},
	{
		initialRouteName: "Auth"
	}
);

export default class App extends Component {
	constructor(props) {
		super(props);
		//createData();
	}

	render() {
		return <SwitchNav />;
	}
}
