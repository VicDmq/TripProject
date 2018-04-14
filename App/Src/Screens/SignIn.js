//Import des composants
import React, { Component } from "react";
import { View, Screen, Title, TextInput, Button, Text, Icon, Image, Caption } from "@shoutem/ui";
//Module permettant d'afficher des messages suite aux actions de l'utilisateur
import DropdownAlert from "react-native-dropdownalert";

//Composants customisés
import NavBarComponent from "../Components/NavBar";
import DropdownAlertComponent from "../Components/DropdownAlert";

//Fonctions back-end
import { getObjectsFiltered } from "../../DataAccess/Scripts/Requests";
import { setConnectedUserTokens } from "../../DataAccess/ObjectsRepositories/UserRepository";

//Écran de connexion
export default class SignInScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: "",
			password: "",
			feedback: this.checkIfFeedback()
		};
	}

	//Demande de connexion par l'utilisateur
	logIn = async () => {
		const request = "login ='" + this.state.login + "' AND password='" + this.state.password + "'";
		const user = getObjectsFiltered("User", request)[0];
		//S'il n'existe aucun utilisateur ayant ce login et ce mot de passe ==> user est undefined
		if (user != undefined) {
			//On stocke son login et son mot de passe : permet de se reconnecter sans passer par cet écran
			await setConnectedUserTokens(user);
			this.props.navigation.navigate("App");
		} else {
			//Affichage d'un message d'erreur
			this.setState({
				feedback: { type: "error", title: "Erreur", text: "Identifiant ou mot de passe incorrect" },
				password: ""
			});
		}
	};

	//Permet d'afficher un message après l'ajout d'un utilisateur
	checkIfFeedback = () => {
		//Ces paramètres sont envoyés par la page SignUp
		//Vaut withFeedback si défini et false sinon
		const withFeedback = this.props.navigation.getParam("withFeedback", false);
		if (withFeedback === true) {
			const { params } = this.props.navigation.state;
			return { type: params.type, title: params.title, text: params.text };
		}
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<NavBarComponent title={"Connexion"} />
				<View style={{ flex: 1, alignItems: "center" }}>
					<Title styleName="bold" style={{ marginTop: 30, marginBottom: 5 }}>
						Bienvenue sur Trip project !
					</Title>
					<Caption style={{ marginBottom: 25 }}>Commencez par vous connecter ;-)</Caption>
					<Image styleName="medium-avatar" style={{ marginBottom: 20 }} source={require("../Images/map.jpg")} />
					{/* Login */}
					<TextInput
						value={this.state.login}
						placeholder={"Identifiant"}
						onChangeText={login => {
							this.setState({ login: login });
						}}
						style={{ marginBottom: 5 }}
					/>
					{/* Mot de passe  */}
					<TextInput
						secureTextEntry
						value={this.state.password}
						placeholder={"Mot de passe"}
						onChangeText={password => {
							this.setState({ password: password });
						}}
						style={{ marginBottom: 15 }}
					/>

					{/* Boutons pour connexion et ajout de compte */}
					<View styleName="horizontal h-center" style={{ marginTop: 20 }}>
						<Button
							styleName="create-account"
							style={{ marginRight: 10 }}
							onPress={() => this.props.navigation.navigate("SignUp")}
						>
							<Text>Nouveau compte</Text>
							<Icon name="add-friend" />
						</Button>

						<Button styleName="connect" onPress={() => this.logIn()}>
							<Text>Connexion</Text>
							<Icon name="checkbox-on" />
						</Button>
					</View>
				</View>
				{/* Composant permettant d'afficher messages d'erreur et de succès */}
				<DropdownAlertComponent feedbackProps={this.state.feedback} />
			</View>
		);
	}
}
