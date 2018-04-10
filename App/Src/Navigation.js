import { StackNavigator, TabNavigator, TabBarBottom, SwitchNavigator } from "react-navigation";
import React from "react";
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

const AppTab = TabNavigator(
	{
		Home: {
			screen: HomeScreen,
			navigationOptions: {
				tabBarLabel: "Accueil",
				tabBarIcon: ({ focused, tintColor }) => {
					return <Icon name="ios-information-circle-outline" size={30} color={tintColor} />;
				}
			}
		},
		Trip: {
			screen: UserTripsScreen,
			navigationOptions: {
				tabBarLabel: "Accueil"
			}
		},
		UsersDatas: {
			screen: UserDatasScreen,
			navigationOptions: {
				tabBarLabel: "Accueil"
			}
		},
		Account: {
			screen: UserAccountScreen,
			navigationOptions: {
				tabBarLabel: "Accueil"
			}
		}
	},
	{
		// navigationOptions: ({ navigation }) => ({
		// 	tabBarIcon: <Icon name="rocket" size={30} color="#900" />
		// 	// tabBarIcon: ({ focused, tintColor }) => {
		// 	// 	const { routeName } = navigation.state;
		// 	// 	let iconName;
		// 	// 	if (routeName === "Home") {
		// 	// 		iconName = `ios-information-circle${focused ? "" : "-outline"}`;
		// 	// 	} else if (routeName === "Settings") {
		// 	// 		iconName = `ios-options${focused ? "" : "-outline"}`;
		// 	// 	}

		// 	// 	// You can return any component that you like here! We usually use an
		// 	// 	// icon component from react-native-vector-icons
		// 	// 	return <Icon name="rocket" size={30} color="#900" />;
		// }),
		initialRouteName: "Home",
		tabBarComponent: TabBarBottom,
		tabBarPosition: "bottom"
	}
);

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
