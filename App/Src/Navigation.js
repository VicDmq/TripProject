import { StackNavigator, TabNavigator, TabBarBottom, SwitchNavigator } from "react-navigation";
import React from "react";

//Icônes de TabBar
import Icon from "react-native-vector-icons/FontAwesome";

//Écrans inclus dans AppTab
import HomeScreen from "./Screens/Home";
import UserTripsScreen from "./Screens/UserTrips";
import UserDatasScreen from "./Screens/UsersDatas";
import UserAccountScreen from "./Screens/UserAccount";
import TripScreen from "./Screens/Trip";
import LegOfTripScreen from "./Screens/LegOfTrip";
import BudgetScreen from "./Screens/Budget";
import UpdateBudgetScreen from "./Screens/UpdateBudget";

//Écrans inclus dans AuthStack
import SignInScreen from "./Screens/SignIn";
import SignUpScreen from "./Screens/SignUp";

//Écrans disponibles partout dans l'app
import AuthLoadingScreen from "./Screens/AuthLoading";

//StackNavigator utilisé pour la connexion et l'inscription
const AuthStack = StackNavigator(
	{
		SignIn: { screen: SignInScreen },
		SignUp: { screen: SignUpScreen }
	},
	{
		navigationOptions: {
			header: null
		}
	}
);

const HomeStack = StackNavigator(
	{
		Home: { screen: HomeScreen },
		HomeTrip: { screen: TripScreen },
		HomeLegOfTrip: { screen: LegOfTripScreen },
		HomeBudget: { screen: BudgetScreen },
		HomeUpdateBudget: { screen: UpdateBudgetScreen }
	},
	{
		navigationOptions: {
			header: null
		},
		initialRouteName: "Home"
	}
);

const TripStack = StackNavigator(
	{
		UserTrips: { screen: UserTripsScreen },
		Trip: { screen: TripScreen },
		LegOfTrip: { screen: LegOfTripScreen },
		Budget: { screen: BudgetScreen },
		UpdateBudget: { screen: UpdateBudgetScreen }
	},
	{
		navigationOptions: {
			header: null
		},
		initialRouteName: "UserTrips"
	}
);

const AccountStack = StackNavigator(
	{
		Account: { screen: UserAccountScreen },
		UpdateAccount: { screen: SignUpScreen }
	},
	{
		navigationOptions: {
			header: null
		},
		initialRouteName: "Account"
	}
);

//TabNavigator utilisé une fois que l'utilisateur est connecté : navigation au sein de l'app
//C'est ici que la tabbar est stylisé
const AppTab = TabNavigator(
	{
		Home: {
			screen: HomeStack,
			navigationOptions: {
				tabBarLabel: "Accueil",
				tabBarIcon: ({ focused, tintColor }) => {
					return <Icon name="home" size={22} color={tintColor} />;
				}
			}
		},
		Trip: {
			screen: TripStack,
			navigationOptions: {
				tabBarLabel: "Voyages",
				tabBarIcon: ({ focused, tintColor }) => {
					return <Icon name="map-signs" size={22} color={tintColor} />;
				}
			}
		},
		UsersDatas: {
			screen: UserDatasScreen,
			navigationOptions: {
				tabBarLabel: "Données",
				tabBarIcon: ({ focused, tintColor }) => {
					return <Icon name="database" size={22} color={tintColor} />;
				}
			}
		},
		AccountStack: {
			screen: AccountStack,
			navigationOptions: {
				tabBarLabel: "Compte",
				tabBarIcon: ({ focused, tintColor }) => {
					return <Icon name="user" size={22} color={tintColor} />;
				}
			}
		}
	},
	{
		initialRouteName: "Home",
		tabBarComponent: TabBarBottom,
		tabBarPosition: "bottom",
		tabBarOptions: {
			activeTintColor: "skyblue",
			inactiveTintColor: "lightgrey",
			labelStyle: {
				fontSize: 9
			},
			style: {
				backgroundColor: "black"
			}
		}
	}
);

//Navigation exporté dans TripProject
export const Navigation = SwitchNavigator(
	{
		AuthLoading: AuthLoadingScreen,
		Auth: AuthStack,
		App: AppTab
	},
	{
		initialRouteName: "AuthLoading"
	}
);
