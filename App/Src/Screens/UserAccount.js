import React, { Component } from "react";
import { Text, View, Button, Title, Image, Divider, Icon } from "@shoutem/ui";
//Module permettant d'afficher des messages suite aux actions de l'utilisateur
import DropdownAlert from "react-native-dropdownalert";

import SpinnerComponent from "../Components/Spinner";
import NavBarComponent from "../Components/NavBar";

import { getConnectedUser, getConnectedUserTokens } from "../../DataAccess/ObjectsRepositories/UserRepository";
import { getCurrencyByCode } from "../../DataAccess/ObjectsRepositories/CurrencyRepository";

export default class UserAccountScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userTokens: undefined,
			userInformations: undefined
		};
		this.setInitialState();
	}

	setInitialState = async () => {
		const userTokens = await getConnectedUserTokens();
		await this.setState({ userTokens: userTokens });
		this.setUserState();
	};

	setUserState = async () => {
		const user = getConnectedUser(this.state.userTokens.login, this.state.userTokens.password);
		this.setState({
			userInformations: {
				login: user.login,
				firstName: user.firstName,
				lastName: user.lastName,
				password: user.password,
				currencyCode: user.currency.code
			}
		});
	};

	getCurrencyToString = () => {
		const currency = getCurrencyByCode(this.state.userInformations.currencyCode);
		return currency.name + " (" + currency.symbol + ")";
	};

	//Permet d'afficher un message après la modification d'un utilisateur
	checkIfFeedback = () => {
		//Ces paramètres sont envoyés par la page SignUp
		//Vaut withFeedback si défini et false sinon
		console.log(this.props.navigation.getParam("withFeedback", false));
		const withFeedback = this.props.navigation.getParam("withFeedback", false);
		if (withFeedback === true) {
			const { params } = this.props.navigation.state;
			this.writeFeedback(params.type, params.title, params.text);
			//Permet de n'afficher le message qu'une seule fois
			this.props.navigation.setParams({ withFeedback: false });
		}
	};

	//Affichage d'un message
	writeFeedback = (type, title, text) => {
		this.dropdown.alertWithType(type, title, text);
	};

	render() {
		if (this.state.userTokens === undefined || this.state.userInformations === undefined) {
			return <SpinnerComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<NavBarComponent title={"Compte"} logoutButton={true} />
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
							style={{ marginTop: 20 }}
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
					<DropdownAlert
						ref={ref => {
							this.dropdown = ref;
							this.checkIfFeedback();
						}}
						successImageSrc={require("../Images/checked.png")}
						closeInterval={5000}
						updateStatusBar={false}
						defaultContainer={{
							marginLeft: 8,
							marginRight: 8,
							marginTop: 8,
							padding: 8,
							flexDirection: "row",
							borderRadius: 50
						}}
					/>
				</View>
			);
		}
	}
}
