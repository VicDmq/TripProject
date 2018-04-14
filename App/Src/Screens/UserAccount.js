import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Text, View, Button, Title, Image, Divider, Icon } from "@shoutem/ui";

import SpinnerComponent from "../Components/Spinner";
import NavBarComponent from "../Components/NavBar";
import DropdownAlertComponent from "../Components/DropdownAlert";

import { getConnectedUser, getConnectedUserTokens } from "../../DataAccess/ObjectsRepositories/UserRepository";
import { getCurrencyByCode } from "../../DataAccess/ObjectsRepositories/CurrencyRepository";

//Page d'aperçu du compte de l'utilisateur
export default class UserAccountScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userTokens: undefined,
			userInformations: undefined,
			feedback: this.checkIfFeedback()
		};
		this.setInitialState();
	}

	//Défini les tokens (login et password)
	setInitialState = async () => {
		const userTokens = await getConnectedUserTokens();
		await this.setState({ userTokens: userTokens });
		this.setUserState();
	};

	//On récupère l'utilisateur connecté puis on entre ses infos dans this.state.userInformations
	setUserState = async () => {
		const user = getConnectedUser(this.state.userTokens.login, this.state.userTokens.password);
		this.setState({
			userInformations: {
				login: user.login,
				firstName: user.firstName,
				lastName: user.lastName,
				password: user.password,
				//On ne stocke que le code de la monnaie
				currencyCode: user.currency.code
			}
		});
	};

	///Utilisé pour l'affichage de la monnaie
	getCurrencyToString = () => {
		const currency = getCurrencyByCode(this.state.userInformations.currencyCode);
		return currency.name + " (" + currency.symbol + ")";
	};

	//Permet d'afficher un message après la modification d'un utilisateur
	checkIfFeedback = () => {
		//Vaut withFeedback si défini et false sinon
		const withFeedback = this.props.navigation.getParam("withFeedback", false);
		if (withFeedback === true) {
			const { params } = this.props.navigation.state;
			return { type: params.type, title: params.title, text: params.text };
		}
	};

	render() {
		if (this.state.userTokens === undefined || this.state.userInformations === undefined) {
			return <SpinnerComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<NavBarComponent title={"Compte"} logoutButton={true} />
					<ScrollView>
						<View style={{ flex: 1, alignItems: "center" }}>
							<Title styleName="bold" style={{ marginTop: 10, marginBottom: 10 }}>
								{this.state.userInformations.login}
							</Title>
							<Image styleName="medium-avatar" style={{ marginBottom: 10 }} source={require("../Images/map.jpg")} />
							<View style={{ alignItems: "center" }}>
								<Divider styleName="section-header label-value-divider">
									<Text styleName={"left-component"}>Nom</Text>
									<Text styleName={"right-component"}>{this.state.userInformations.lastName}</Text>
								</Divider>
							</View>
							<View style={{ marginTop: 8, alignItems: "center" }}>
								<Divider styleName="section-header label-value-divider">
									<Text styleName={"left-component"}>Prénom</Text>
									<Text styleName={"right-component"}>{this.state.userInformations.firstName}</Text>
								</Divider>
							</View>

							<View style={{ marginTop: 8, alignItems: "center" }}>
								<Divider styleName="section-header label-value-divider">
									<Text styleName={"left-component"}>Devise</Text>
									<Text styleName={"right-component"}>{this.getCurrencyToString()}</Text>
								</Divider>
							</View>

							<Button
								styleName="rounded-button"
								style={{ marginTop: 20, marginBottom: 15 }}
								onPress={() => {
									this.props.navigation.navigate("UpdateAccount", {
										isSignUpScreen: false,
										userTokens: this.state.userTokens,
										userInformations: this.state.userInformations
									});
								}}
							>
								<Icon name="edit" />
							</Button>
						</View>
					</ScrollView>
					<DropdownAlertComponent feedbackProps={this.state.feedback} />
				</View>
			);
		}
	}
}
