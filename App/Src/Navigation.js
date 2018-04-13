import { StackNavigator, TabNavigator, TabBarBottom, SwitchNavigator } from "react-navigation";
import React from "react";

//Icônes de TabBar
import Icon from "react-native-vector-icons/FontAwesome";

//Écrans inclus dans AppTab
import HomeScreen from "./Screens/Home";
import UserTripsScreen from "./Screens/UserTrips";
import UserDatasScreen from "./Screens/UsersDatas";
import UserAccountScreen from "./Screens/UserAccount";

//Écrans inclus dans AuthStack
import SignInScreen from "./Screens/SignIn";
import SignUpScreen from "./Screens/SignUp";

//Écrans disponibles partout dans l'app
import ModalMessageBoxComponent from "./Components/MessageBoxModal";
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
			screen: HomeScreen,
			navigationOptions: {
				tabBarLabel: "Accueil",
				tabBarIcon: ({ focused, tintColor }) => {
					return <Icon name="home" size={22} color={tintColor} />;
				}
			}
		},
		Trip: {
			screen: UserTripsScreen,
			navigationOptions: {
				tabBarLabel: "Mes voyages",
				tabBarIcon: ({ focused, tintColor }) => {
					return <Icon name="map-signs" size={22} color={tintColor} />;
				}
			}
		},
		UsersDatas: {
			screen: UserDatasScreen,
			navigationOptions: {
				tabBarLabel: "Données voyages",
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
		Modal: ModalMessageBoxComponent,
		AuthLoading: AuthLoadingScreen,
		Auth: AuthStack,
		App: AppTab
	},
	{
		initialRouteName: "AuthLoading"
	}
);
