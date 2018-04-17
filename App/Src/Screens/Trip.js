import React, { Component } from "react";
import { ScrollView, Modal } from "react-native";
import {
	View,
	Text,
	Icon,
	TextInput,
	Divider,
	Caption,
	ListView,
	Button,
	TouchableOpacity,
	Row,
	Subtitle
} from "@shoutem/ui";

import NavBarComponent from "../Components/NavBar";
import SpinnerComponent from "../Components/Spinner";
import DropdownAlertComponent from "../Components/DropdownAlert";

import { getConnectedUserTokens, getConnectedUser } from "../../DataAccess/ObjectsRepositories/UserRepository";
import { getDateToString } from "../../Functions";
import {
	getTrip,
	addLegOfTrip,
	getLegOfTrip,
	updateLegOfTrip,
	deleteLegOfTrip,
	addTrip,
	updateTrip
} from "../../DataAccess/ObjectsRepositories/TripRepository";
import { getTownByNameAndCountryName } from "../../DataAccess/ObjectsRepositories/TownRepository";

export default class TripScreen extends Component {
	constructor(props) {
		super(props);
		this.state = this.updateStateFromProps();
	}

	updateStateFromProps = () => {
		const isNewTrip = this.props.navigation.getParam("isNewTrip", true);
		const callingScreen = this.props.navigation.getParam("callingScreen", "UserTrips");
		const { params } = this.props.navigation.state;
		if (isNewTrip) {
			return {
				navBarTitle: "Nouveau voyage",
				userTokens: params.userTokens,
				callingScreen: callingScreen,
				isNewTrip: true,
				title: "",
				legsOfTrip: [],
				deleteMode: {
					value: false,
					legsOfTripIndexesToDelete: []
				},
				disableTouch: false,
				feedback: undefined,
				isEditable: true
			};
		} else {
			return {
				navBarTitle: "Mon voyage",
				userTokens: params.userTokens,
				callingScreen: callingScreen,
				isNewTrip: false,
				lastState: params.trip.lastState,
				title: params.trip.lastState.title,
				legsOfTrip: params.trip.legsOfTrip,
				deleteMode: {
					value: false,
					legsOfTripIndexesToDelete: []
				},
				disableTouch: false,
				feedback: undefined,
				isEditable: params.trip.lastState.dateOfArrival - new Date() > 0 ? true : false
			};
		}
	};

	updateLegsOfTripState = (legOfTrip, index = undefined) => {
		const legsOfTrip = this.state.legsOfTrip;
		if (index !== undefined) {
			legsOfTrip[index].dateOfArrival = legOfTrip.dateOfArrival;
			legsOfTrip[index].dateOfDeparture = legOfTrip.dateOfDeparture;
			legsOfTrip[index].countryName = legOfTrip.countryName;
			legsOfTrip[index].townName = legOfTrip.townName;
			legsOfTrip[index].typeOfBudget = legOfTrip.typeOfBudget;
		} else {
			legsOfTrip.push({
				status: "new",
				dateOfArrival: legOfTrip.dateOfArrival,
				dateOfDeparture: legOfTrip.dateOfDeparture,
				countryName: legOfTrip.countryName,
				townName: legOfTrip.townName,
				typeOfBudget: legOfTrip.typeOfBudget
			});
		}
		this.setState({ legsOfTrip: legsOfTrip });
	};

	onSaveOrUpdate = () => {
		let legsOfTripLength = 0;
		this.state.legsOfTrip.forEach(legOfTrip => {
			if (legOfTrip.status !== "willBeRemoved") legsOfTripLength++;
		});

		if (legsOfTripLength !== 0 && this.state.title !== "") {
			const user = getConnectedUser(this.state.userTokens.login, this.state.userTokens.password);
			const newLegsOfTrip = [];
			let newDateOfArrival = undefined;

			if (this.state.isNewTrip) {
				this.state.legsOfTrip.forEach(legOfTrip => {
					const realmTown = getTownByNameAndCountryName(legOfTrip.townName, legOfTrip.countryName);
					newLegsOfTrip.push(
						addLegOfTrip(legOfTrip.dateOfArrival, legOfTrip.dateOfDeparture, realmTown, legOfTrip.typeOfBudget)
					);
				});
				newDateOfArrival = addTrip(user, this.state.title, newLegsOfTrip).dateOfArrival;
			} else {
				const realmTrip = getTrip(
					user,
					this.state.lastState.title,
					this.state.lastState.dateOfArrival,
					this.state.lastState.dateOfDeparture
				);

				this.state.legsOfTrip.forEach(legOfTrip => {
					if (legOfTrip.status === "new") {
						const realmTown = getTownByNameAndCountryName(legOfTrip.townName, legOfTrip.countryName);
						newLegsOfTrip.push(
							addLegOfTrip(legOfTrip.dateOfArrival, legOfTrip.dateOfDeparture, realmTown, legOfTrip.typeOfBudget)
						);
					}
					if (legOfTrip.status === "toUpdate") {
						const lastStateForAuth = legOfTrip.lastStateForAuth;
						const realmLegOfTrip = getLegOfTrip(
							realmTrip,
							lastStateForAuth.townName,
							lastStateForAuth.dateOfArrival,
							lastStateForAuth.dateOfDeparture
						);
						const realmTown = getTownByNameAndCountryName(legOfTrip.townName, legOfTrip.countryName);
						updateLegOfTrip(
							realmTrip,
							realmLegOfTrip,
							legOfTrip.dateOfArrival,
							legOfTrip.dateOfDeparture,
							realmTown,
							legOfTrip.typeOfBudget
						);
					}
					if (legOfTrip.status === "willBeRemoved") {
						const lastStateForAuth = legOfTrip.lastStateForAuth;
						const realmLegOfTrip = getLegOfTrip(
							realmTrip,
							lastStateForAuth.townName,
							lastStateForAuth.dateOfArrival,
							lastStateForAuth.dateOfDeparture
						);
						deleteLegOfTrip(realmLegOfTrip);
					}
				});

				updateTrip(realmTrip, this.state.title, newLegsOfTrip);
				newDateOfArrival = realmTrip.dateOfArrival;
			}

			this.props.navigation.navigate(this.state.callingScreen, {
				withFeedback: true,
				type: "success",
				title: this.state.isNewTrip ? "Voyage ajouté !" : "Voyage mis à jour !",
				text: "Vous pouvez encore modifier ce voyage jusqu'au " + getDateToString(newDateOfArrival)
			});
		} else {
			this.setState({
				feedback: {
					type: "error",
					title: "Sauvegarde impossible",
					text: "Tous les champs obligatoires n'ont pas été remplis"
				}
			});
			setTimeout(() => {
				this.setState({ feedback: undefined });
			}, 2000);
		}
	};

	getLegsOfTripToShow = () => {
		const legsOfTrip = [];
		this.state.legsOfTrip.forEach(legOfTrip => {
			if (legOfTrip.status !== "willBeRemoved") {
				legsOfTrip.push(legOfTrip);
			}
		});
		return legsOfTrip;
	};

	renderRow = legOfTrip => {
		const index = this.state.legsOfTrip.indexOf(legOfTrip);
		let functionToApplyOnPress = undefined;
		let iconToRender = undefined;

		if (this.state.deleteMode.value) {
			functionToApplyOnPress = () => {
				const legsOfTripIndexesToDelete = this.state.deleteMode.legsOfTripIndexesToDelete;
				if (legsOfTripIndexesToDelete.includes(index)) {
					legsOfTripIndexesToDelete.splice(legsOfTripIndexesToDelete.indexOf(index), 1);
				} else {
					legsOfTripIndexesToDelete.push(index);
				}
				this.setState({ deleteMode: { value: true, legsOfTripIndexesToDelete: legsOfTripIndexesToDelete } });
			};

			iconToRender =
				this.state.deleteMode.legsOfTripIndexesToDelete.includes(index) === true ? (
					<Icon styleName="disclosure" name="checkbox-on" style={{ color: "red", opacity: 1 }} />
				) : (
					<Icon styleName="disclosure" name="checkbox-off" style={{ color: "red", opacity: 1 }} />
				);
		} else {
			functionToApplyOnPress = () => {
				this.disableTouch();
				const JSONToSend = this.state.isEditable
					? {
							index: index,
							updateLegsOfTrip: this.updateLegsOfTripState,
							legOfTrip: legOfTrip,
							isNewLegOfTrip: false
					  }
					: {
							isNewLegOfTrip: false,
							isEditable: false,
							legOfTrip: legOfTrip
					  };
				const screenToNavigateTo = this.state.callingScreen === "Home" ? "HomeLegOfTrip" : "LegOfTrip";
				this.props.navigation.navigate(screenToNavigateTo, JSONToSend);
			};

			iconToRender = <Icon styleName="disclosure" name="right-arrow" />;
		}

		return (
			<TouchableOpacity
				disabled={this.state.disableTouch}
				onPress={() => {
					functionToApplyOnPress();
				}}
				styleName="custom"
			>
				<Row>
					<View styleName="vertical">
						<Subtitle styleName="title">{legOfTrip.townName + " (" + legOfTrip.countryName + ") "}</Subtitle>
						<Text numberOfLines={1}>
							Du {getDateToString(legOfTrip.dateOfArrival)} au {getDateToString(legOfTrip.dateOfDeparture)}
						</Text>
					</View>
					{iconToRender}
				</Row>
			</TouchableOpacity>
		);
	};

	handleDeletion = () => {
		if (this.state.deleteMode.value) {
			const legsOfTrip = this.state.legsOfTrip;
			const legsOfTripIndexesToDelete = this.state.deleteMode.legsOfTripIndexesToDelete;
			legsOfTripIndexesToDelete.forEach(index => {
				if (legsOfTrip[index].status === "toUpdate") {
					legsOfTrip[index].status = "willBeRemoved";
				} else {
					legsOfTrip.splice(index, 1);
				}
			});
			this.setState({ deleteMode: { value: false, legsOfTripIndexesToDelete: [] }, legsOfTrip: legsOfTrip });
		} else {
			this.setState({ deleteMode: { value: true, legsOfTripIndexesToDelete: [] } });
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
		if (this.state.userTokens === undefined) {
			return <SpinnerComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<NavBarComponent title={"Nouveau voyage"} backButton={true} />
					<ScrollView style={{ flex: 1 }}>
						<Divider styleName="section-header custom-divider">
							<Caption>Titre du voyage (obligatoire)</Caption>
						</Divider>
						<View styleName="horizontal h-center" style={{ marginTop: 15 }}>
							<TextInput
								editable={this.state.isEditable}
								styleName="small-height"
								style={{ flex: 0.7, marginLeft: 25, marginRight: 5 }}
								value={this.state.title}
								placeholder={"Titre de votre voyage ?"}
								onChangeText={title => this.setState({ title: title })}
							/>
							{this.state.title !== "" ? (
								<Icon style={{ flex: 0.3, color: "green" }} name="checkbox-on" />
							) : (
								<Icon style={{ flex: 0.3, color: "red" }} name="error" />
							)}
						</View>
						<View style={{ flex: 1, marginTop: 30 }}>
							<Divider styleName="section-header custom-divider">
								<Caption>Étapes du voyage (1 étapes obligatoire)</Caption>
							</Divider>
							<ListView style={{ flex: 1 }} data={this.getLegsOfTripToShow()} renderRow={this.renderRow} />
						</View>
						<View
							styleName="horizontal"
							style={{
								marginTop: 10,
								marginBottom: 10,
								marginRight: 10,
								marginLeft: 10
							}}
						>
							{this.state.isEditable === true ? (
								<View style={{ flex: 0.5, alignItems: "flex-start" }}>
									<Button
										disabled={this.state.disableTouch}
										styleName="rounded-button"
										style={{ backgroundColor: "red" }}
										onPress={() => {
											this.handleDeletion();
										}}
									>
										{this.state.deleteMode.value ? <Icon name="checkbox-on" /> : <Icon name="minus-button" />}
									</Button>
								</View>
							) : null}
							{this.state.isEditable === true ? (
								<View style={{ flex: 0.5, alignItems: "flex-end" }}>
									<Button
										disabled={this.state.disableTouch}
										styleName="rounded-button"
										style={{ backgroundColor: "green" }}
										onPress={() => {
											this.disableTouch();
											const screenToNavigateTo = this.state.callingScreen === "Home" ? "HomeLegOfTrip" : "LegOfTrip";
											this.props.navigation.navigate(screenToNavigateTo, {
												updateLegsOfTrip: this.updateLegsOfTripState
											});
										}}
									>
										<Icon name="plus-button" />
									</Button>
								</View>
							) : null}
						</View>
					</ScrollView>
					{this.state.isEditable === true ? (
						<View
							style={{
								alignItems: "center",
								paddingTop: 10,
								paddingBottom: 10,
								borderTopWidth: 1,
								borderTopColor: "lightgrey"
							}}
						>
							<Button
								disabled={this.state.disableTouch}
								styleName="connect"
								onPress={() => {
									this.disableTouch();
									this.onSaveOrUpdate();
								}}
							>
								<Text>Sauvegarder</Text>
								<Icon name="checkbox-on" />
							</Button>
						</View>
					) : null}
					<DropdownAlertComponent feedbackProps={this.state.feedback} />
				</View>
			);
		}
	}
}
