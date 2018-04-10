import { createObject, updateObjectProperty } from "../Scripts/UpdateDatabase";
import { getObjectsFiltered } from "../Scripts/Requests";
import { AsyncStorage } from "react-native";

//TODO : Créer une fonction qui permet d'avoir automatiquement
//la localisation de l'utilisateur

//Création d'un utilisateur
export const addUser = (login, password, lastName, firstName, currency) => {
	const properties = {
		login: login,
		password: password,
		lastName: lastName,
		firstName: firstName,
		currency: currency
	};

	return createObject("User", properties);
	//Nécessaire de retourner un utilisateur
};

export const updateUser = (user, newLogin, newPassword, newLastName, newFirstName, newCurrency) => {
	updateObjectProperty(user, "login", newLogin);
	updateObjectProperty(user, "password", newPassword);
	updateObjectProperty(user, "lastName", newLastName);
	updateObjectProperty(user, "firstName", newFirstName);
	updateObjectProperty(user, "currency", newCurrency);
};

//Ces fonctions sont utilisées afin de stocker l'utilisateur connecté (permet de se connecter directement à l'app)
//Connection réussi : on stocke son id et mot de passe pour récupérer ses données plus tard dans l'app
export const setConnectedUserTokens = async user => {
	await AsyncStorage.setItem("userLogin", user.login);
	await AsyncStorage.setItem("userPassword", user.password);
};

//Déconnexion : il est redirigé vers la page d'authentification
export const removeConnectedUser = async () => {
	await AsyncStorage.clear();
};

//On récupère les données de l'utilisateur grâce à l'id et au mdp stockés
export const getConnectedUser = async () => {
	const login = await AsyncStorage.getItem("userLogin");
	const password = await AsyncStorage.getItem("userPassword");
	const request = "login ='" + login + "' AND password='" + password + "'";
	return getObjectsFiltered("User", request)[0];
};
