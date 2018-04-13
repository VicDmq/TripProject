import { createObject, updateObjectProperty } from "../Scripts/UpdateDatabase";
import { getObjectsFiltered } from "../Scripts/Requests";
import { AsyncStorage } from "react-native";

//TODO : Créer une fonction qui permet d'avoir automatiquement
//la localisation de l'utilisateur

//Création d'un utilisateur
export const addUser = (login, password, lastName, firstName, currency) => {
	//On commence par vérifier si le login n'existe pas
	checkIfLoginAlreadyExist(login);
	//Puis on s'assure que les champs obligatoires ont bien été remplis
	checkRequiredFields(login, password);

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

export const updateUser = (user, isSameLogin, newLogin, newPassword, newLastName, newFirstName, newCurrency) => {
	//Même chose que pour l'ajout
	if (!isSameLogin) {
		checkIfLoginAlreadyExist(newLogin);
	}
	checkRequiredFields(newLogin, newPassword);

	//On teste si le mot de passe est toujours le même
	const isSamePassword = user.password === newPassword;

	updateObjectProperty(user, "login", newLogin);
	updateObjectProperty(user, "password", newPassword);
	updateObjectProperty(user, "lastName", newLastName);
	updateObjectProperty(user, "firstName", newFirstName);
	updateObjectProperty(user, "currency", newCurrency);

	if (!isSameLogin || !isSamePassword) {
		removeConnectedUser();
		setConnectedUserTokens(user);
	}
};

//Retourne une erreur si le login existe déjà
const checkIfLoginAlreadyExist = login => {
	const request = "login ='" + login + "'";
	if (getObjectsFiltered("User", request).length !== 0) {
		throw new Error("Cet identifiant existe déjà !");
	}
};

//Retourne une erreur si les champs obligatoires ne sont pas remplis
const checkRequiredFields = (login, password) => {
	if (login === "" || password === "") {
		throw new Error("Les champs obligatoires n'ont pas été remplis !");
	}
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
export const getConnectedUserTokens = async () => {
	let tokens = undefined;
	const login = await AsyncStorage.getItem("userLogin");
	const password = await AsyncStorage.getItem("userPassword");
	if (login !== null && password !== null) {
		tokens = {
			login: login,
			password: password
		};
	}
	return tokens;
};

//Requête permettant de récupérer l'utilisateur connecté dans l'application
export const getConnectedUser = (login, password) => {
	const request = "login ='" + login + "' AND password='" + password + "'";
	return getObjectsFiltered("User", request)[0];
};
