import { createObject, updateObjectProperty } from "../Scripts/UpdateDatabase";
import { getObjectsFiltered } from "../Scripts/Requests";
import { AsyncStorage } from "react-native";

//TODO : Créer une fonction qui permet d'avoir automatiquement
//la localisation de l'utilisateur

//Création d'un utilisateur
export const addUser = (login, password, lastName, firstName, location) => {
	const properties = {
		login: login,
		password: password,
		lastName: lastName,
		firstName: firstName,
		location: location //Pays où il habite : permet d'avoir sa devise
	};

	return createObject("User", properties);
	//Nécessaire de retourner un utilisateur
};

export const updateUser = (user, newLogin, newPassword, newLastName, newFirstName, newLocation) => {
	updateObjectProperty(user, "login", newLogin);
	updateObjectProperty(user, "password", newPassword);
	updateObjectProperty(user, "lastName", newLastName);
	updateObjectProperty(user, "firstName", newFirstName);
	updateObjectProperty(user, "location", newLocation);
};

export const getUserConnected = async () => {
	const login = await AsyncStorage.getItem("userLogin");
	const password = await AsyncStorage.getItem("userPassword");
	const request = "login ='" + login + "' AND password='" + password + "'";
	return getObjectsFiltered("User", request)[0];
};
