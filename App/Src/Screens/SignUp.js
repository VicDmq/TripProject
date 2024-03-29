//Import des composants
import React, { Component } from "react";
import { Picker, ScrollView } from "react-native";
import { View, Text, TextInput, Caption, Icon, Divider, Button } from "@shoutem/ui";

//Composants customisés
import NavBarComponent from "../Components/NavBar";
import DropdownAlertComponent from "../Components/DropdownAlert";

//Fonctions back-end
import { getObjects, getObjectsFiltered } from "../../DataAccess/Scripts/Requests";
import { addUser, updateUser, getConnectedUser } from "../../DataAccess/ObjectsRepositories/UserRepository";
import { getCurrencyByCode } from "../../DataAccess/ObjectsRepositories/CurrencyRepository";

//Écran d'inscription mais aussi de modification du compte
export default class SignUpScreen extends Component {
	constructor(props) {
		super(props);
		this.state = this.updateStateFromProps();
	}

	//Cette fonction a pour rôle de définir le state initial suivant s'il s'agit de la page
	//d'inscription ou de modification
	updateStateFromProps = () => {
		//Si false ==> alors c'est bien la page de modification des informations du compte
		const isSignUpScreen = this.props.navigation.getParam("isSignUpScreen", true);
		if (isSignUpScreen === false) {
			//Paramètres envoyés depuis la page d'appel
			const { params } = this.props.navigation.state;
			//On a besoin de récupérer l'utilisateur pour ensuite le mettre à jour
			const userTokens = params.userTokens;
			const userInformations = params.userInformations;
			return {
				pageTitle: "Modification",
				userTokens: userTokens,
				login: userInformations.login,
				lastName: userInformations.lastName,
				firstName: userInformations.firstName,
				password: userInformations.password,
				currencyCode: userInformations.currencyCode,
				currencies: this.getCurrenciesForPicker(),
				feedback: undefined,
				disableTouch: false
			};
			//Page d'inscription
		} else {
			return {
				pageTitle: "Inscription",
				userTokens: undefined,
				login: "",
				lastName: "",
				firstName: "",
				password: "",
				currencyCode: getObjects("Currency")[0].code,
				currencies: this.getCurrenciesForPicker(),
				feedback: undefined,
				disableTouch: false
			};
		}
	};

	//Permet de créer la liste des objets à insérer dans un picker
	getCurrenciesForPicker = () => {
		let pickerItems = [];
		//Retourne tous les objets stockés du type demandé (exemple : Currency ou Country)
		const currencies = getObjects("Currency");
		currencies.forEach(currency => {
			pickerItems.push(
				<Picker.Item key={currency.code} label={currency.name + " (" + currency.symbol + ")"} value={currency.code} />
			);
		});
		return pickerItems;
	};

	//Fonction appelée lorsque l'utilisateur souhaite modifier ou créer un compte
	signUpOrUpdate = () => {
		//Variables nécessaires pour le message de feedback
		let type = "";
		let title = "";
		let text = "";
		//Cas de l'inscription
		if (this.state.pageTitle === "Inscription") {
			try {
				addUser(
					this.state.login,
					this.state.password,
					this.state.lastName,
					this.state.firstName,
					getCurrencyByCode(this.state.currencyCode)
				);
				type = "success";
				title = "Inscription réussie";
				text = 'Vous pouvez désormais vous connecter avec le login : "' + this.state.login + '"';
			} catch (error) {
				//Échec de l'insertion : login déjà pris, champs obligatoires non remplis, ...
				type = "error";
				title = "Échec de l'inscription";
				text = error.message;
			}
		}
		//Cas de la modification
		if (this.state.pageTitle === "Modification") {
			try {
				const user = getConnectedUser(this.state.userTokens.login, this.state.userTokens.password);
				updateUser(
					user,
					user.login === this.state.login,
					this.state.login,
					this.state.password,
					this.state.lastName,
					this.state.firstName,
					getCurrencyByCode(this.state.currencyCode)
				);
				type = "success";
				title = "Succès";
				text = "La modification de votre compte a été effectué avec succès";
			} catch (error) {
				//Échec de la modification : même raison que pour l'inscription
				type = "error";
				title = "Échec de la modification";
				text = error.message;
			}
		}
		//En cas d'erreur pas de redirection
		if (type === "error") {
			this.setState({ feedback: { type: type, title: title, text: text } });
			setTimeout(() => {
				this.setState({
					feedback: undefined
				});
			}, 2000);
		} else {
			//Si succès redirection vers la page de connexion ou account
			const nextScreen = this.state.pageTitle === "Inscription" ? "SignIn" : "Account";
			this.props.navigation.navigate(nextScreen, {
				withFeedback: true,
				type: type,
				title: title,
				text: text
			});
		}
	};

	disableTouch = () => {
		this.setState({ disableTouch: true });
		setTimeout(() => {
			this.setState({
				disableTouch: false
			});
		}, 2000);
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<NavBarComponent title={this.state.pageTitle} backButton={true} />
				<ScrollView style={{ flex: 1 }}>
					{/* TextInput pour login */}
					<View>
						<Divider styleName="section-header custom-divider">
							<Caption>Identifiant (obligatoire)</Caption>
						</Divider>
						<View styleName="horizontal">
							<TextInput
								styleName="small-height"
								style={{ flex: 0.7, marginLeft: 25, marginRight: 5 }}
								value={this.state.login}
								placeholder={"Exemple : login"}
								onChangeText={login => this.setState({ login: login })}
							/>
							{this.state.login !== "" ? (
								<Icon style={{ flex: 0.3, color: "green" }} name="checkbox-on" />
							) : (
								<Icon style={{ flex: 0.3, color: "red" }} name="error" />
							)}
						</View>
					</View>

					{/* TextInput pour nom */}
					<View style={{ marginTop: 25 }}>
						<Divider styleName="section-header custom-divider">
							<Caption>Nom (facultatif)</Caption>
						</Divider>
						<View styleName="horizontal">
							<TextInput
								styleName="small-height"
								style={{ flex: 0.7, marginLeft: 25, marginRight: 5 }}
								value={this.state.lastName}
								placeholder={"Exemple : Contador"}
								onChangeText={lastName => this.setState({ lastName: lastName })}
							/>
							{this.state.lastName !== "" ? (
								<Icon style={{ flex: 0.3, color: "green" }} name="checkbox-on" />
							) : (
								<Icon style={{ flex: 0.3, color: "black" }} name="missing" />
							)}
						</View>
					</View>

					{/* TextInput pour prénom */}
					<View style={{ marginTop: 25 }}>
						<Divider styleName="section-header custom-divider">
							<Caption>Prénom (facultatif)</Caption>
						</Divider>
						<View styleName="horizontal">
							<TextInput
								styleName="small-height"
								style={{ flex: 0.7, marginLeft: 25, marginRight: 5 }}
								value={this.state.firstName}
								placeholder={"Exemple : Alberto"}
								onChangeText={firstName => this.setState({ firstName: firstName })}
							/>
							{this.state.firstName !== "" ? (
								<Icon style={{ flex: 0.3, color: "green" }} name="checkbox-on" />
							) : (
								<Icon style={{ flex: 0.3, color: "black" }} name="missing" />
							)}
						</View>
					</View>

					{/* TextInput pour mot de passe */}
					<View style={{ marginTop: 25 }}>
						<Divider styleName="section-header custom-divider">
							<Caption>Mot de passe (obligatoire)</Caption>
						</Divider>
						<View styleName="horizontal">
							<TextInput
								styleName="small-height"
								style={{ flex: 0.7, marginLeft: 25, marginRight: 5 }}
								value={this.state.password}
								placeholder={"Exemple : *Mdp19Fort/"}
								onChangeText={password => this.setState({ password: password })}
							/>
							{this.state.password !== "" ? (
								<Icon style={{ flex: 0.3, color: "green" }} name="checkbox-on" />
							) : (
								<Icon style={{ flex: 0.3, color: "red" }} name="error" />
							)}
						</View>
					</View>

					{/* Picker pour monnaie de l'utilisateur */}
					<View style={{ marginTop: 25, alignItems: "center" }}>
						<Divider styleName="section-header custom-divider">
							<Caption>Devise préférée</Caption>
						</Divider>
						<View
							style={{
								height: 50,
								width: 300,
								borderRadius: 50,
								borderColor: "lightgrey",
								borderWidth: 1,
								marginTop: 15,
								paddingLeft: 15
							}}
						>
							<Picker
								style={{
									flex: 1
								}}
								selectedValue={this.state.currencyCode}
								onValueChange={(itemValue, itemIndex) => this.setState({ currencyCode: itemValue })}
							>
								{this.state.currencies}
							</Picker>
						</View>
					</View>

					{/* Bouton inscription */}
					<View style={{ marginTop: 35, marginBottom: 20, alignItems: "center" }}>
						<Button
							disabled={this.state.disableTouch}
							styleName="connect"
							onPress={() => {
								this.disableTouch();
								this.signUpOrUpdate();
							}}
						>
							<Text>{this.state.pageTitle === "Inscription" ? "S'inscrire" : "Modifier"}</Text>
							<Icon name="checkbox-on" />
						</Button>
					</View>
				</ScrollView>
				{/* Composant permettant l'affichage des messages d'erreurs ou de succès */}
				<DropdownAlertComponent feedbackProps={this.state.feedback} />
			</View>
		);
	}
}
