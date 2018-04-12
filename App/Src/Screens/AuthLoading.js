import React, { Component } from "react";

//Composant customisé
import SpinnerComponent from "../Components/Spinner";

//Permet de récupérer un fichier JSON contenant le login et le password de l'utilisateur connecté
import { getConnectedUserTokens } from "../../DataAccess/ObjectsRepositories/UserRepository";

//Écran jamais affiché ou alors affiche un spinner le temps que la requête asynchronisée s'effectue
export default class AuthLoadingScreen extends React.Component {
	constructor() {
		super();
		this.checkIfUserIsConnected();
	}

	//Si un utilisateur s'est connecté, on redirige vers l'app sinon la page de connexion
	checkIfUserIsConnected = async () => {
		const userTokens = await getConnectedUserTokens();
		this.props.navigation.navigate(userTokens ? "App" : "Auth");
	};

	render() {
		return <SpinnerComponent />;
	}
}
