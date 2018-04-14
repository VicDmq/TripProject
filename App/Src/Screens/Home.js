import React, { Component } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { Text, View, Button, Overlay, Title, ImageBackground, Subtitle, Image } from "@shoutem/ui";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/FontAwesome";

import SpinnerComponent from "../Components/Spinner";
import NabBarComponent from "../Components/NavBar";

import { getConnectedUser, getConnectedUserTokens } from "../../DataAccess/ObjectsRepositories/UserRepository";
import { findNextOrCurrentTrip } from "../../DataAccess/ObjectsRepositories/TripRepository";

export default class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userTokens: undefined,
			titleOfHeadBanner: "Pas de voyages prévus...",
			tripPeriod: undefined,
			tripInformation: undefined,
			refreshing: false
		};
		this.setInitialState();
	}

	setInitialState = async () => {
		const userTokens = await getConnectedUserTokens();
		await this.setState({ userTokens: userTokens });
		this.setTripState();
	};

	setTripState = () => {
		const user = getConnectedUser(this.state.userTokens.login, this.state.userTokens.password);
		let trip = undefined;

		if (user.trips.length !== 0) {
			trip = findNextOrCurrentTrip(user);
		}
		if (trip !== undefined) {
			if (trip.period === "now") {
				this.setState({ titleOfHeadBanner: "En ce moment" });
			} else if (trip.period === "coming") {
				this.setState({ titleOfHeadBanner: "Prochainement" });
			}
			this.setState({ tripPeriod: trip.period, tripInformation: trip.information });
		} else {
			this.setState({
				titleOfHeadBanner: "Pas de voyages prévus...",
				tripPeriod: undefined,
				tripInformation: undefined
			});
		}
	};

	onRefresh() {
		this.setState({ refreshing: true });
		this.setTripState();
		this.setState({ refreshing: false });
	}

	render() {
		if (this.state.userTokens === undefined) {
			return <SpinnerComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<NabBarComponent title={"Accueil"} logoutButton={true} />
					<ScrollView
						refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />}
						contentContainerStyle={{ flex: 1 }}
					>
						<View styleName="headband">
							<Title>{this.state.titleOfHeadBanner}</Title>
						</View>

						<ImageBackground styleName={"image-home"} source={require("../Images/map.jpg")}>
							{this.state.tripInformation !== undefined ? (
								<Overlay styleName="image-overlay start">
									<Title>{this.state.tripInformation.title}</Title>
									<Subtitle styleName="legs-of-trips">{this.state.tripInformation.legsOfTrip}</Subtitle>
									<Subtitle styleName="period">
										Du {this.state.tripInformation.dateOfArrival} au {this.state.tripInformation.dateOfDeparture}
									</Subtitle>
									<Text styleName={"value"} style={{ marginTop: 45 }}>
										{this.state.tripInformation.totalBudget.totalBudgetSpent}{" "}
										{this.state.tripInformation.currencySymbol} /{" "}
										{this.state.tripInformation.totalBudget.totalBudgetPlanned}{" "}
										{this.state.tripInformation.currencySymbol}
									</Text>
									<Text styleName={"legend"}>(Budget dépensé / Budget plannifié)</Text>
									{this.state.tripPeriod === "coming" ? (
										<Button style={{ marginTop: 35 }}>
											<Text style={{ marginRight: 20 }}>Modifier mon voyage</Text>
											<EntypoIcon name="aircraft" size={25} color="white" />
										</Button>
									) : (
										<Button style={{ marginTop: 35 }}>
											<Text style={{ marginRight: 20 }}>Mon budget</Text>
											<Icon name="money" color="white" size={25} />
										</Button>
									)}
									{this.state.tripPeriod === "coming" ? (
										<Button style={{ marginTop: 15 }}>
											<Text style={{ marginRight: 20 }}>Modifier mon budget</Text>
											<Icon name="money" color="white" size={25} />
										</Button>
									) : (
										<Button style={{ marginTop: 15 }}>
											<Text style={{ marginRight: 20 }}>Ajouter une dépense</Text>
											<EntypoIcon name="circle-with-plus" color="white" size={25} />
										</Button>
									)}
								</Overlay>
							) : (
								<Overlay styleName="image-overlay center">
									<Button>
										<Text style={{ marginRight: 20 }}>Ajouter un voyage</Text>
										<EntypoIcon name="circle-with-plus" color="white" size={25} />
									</Button>
									<Text style={{ marginTop: 5 }} styleName={"legend"}>
										Vous ne le regretterez pas ! ;-)
									</Text>
								</Overlay>
							)}
						</ImageBackground>
					</ScrollView>
				</View>
			);
		}
	}
}
