import React, { Component } from "react";
import { Picker, ScrollView } from "react-native";
import { View, Text, Divider, Caption, Button, Icon, TextInput, TouchableOpacity, Switch } from "@shoutem/ui";
import DateTimePicker from "react-native-modal-datetime-picker";
import { RadioButtons, SegmentedControls } from "react-native-radio-buttons";

import NavBarComponent from "../Components/NavBar";
import DropdownAlertComponent from "../Components/DropdownAlert";

import { getObjects, getObjectsFiltered } from "../../DataAccess/Scripts/Requests";
import { getDateToString } from "../../Functions";

const typesOfBudget = [
	{ label: "Petit budget", value: "lowBudget" },
	{ label: "Moyen budget", value: "mediumBudget" },
	{ label: "Gros budget", value: "highBudget" }
];

export default class LegOfTripScreen extends Component {
	constructor(props) {
		super(props);
		this.state = this.updateStateFromProps();
	}

	updateStateFromProps = () => {
		const isNewLegOfTrip = this.props.navigation.getParam("isNewLegOfTrip", true);
		const { params } = this.props.navigation.state;

		if (isNewLegOfTrip) {
			const date = new Date();
			const countryName = getObjects("Country")[0].name;
			const townsPicker = this.getTownsForPicker(countryName);

			return {
				navBarTitle: "Nouvelle étape",
				dateOfArrival: date,
				dateOfDeparture: this.getDateOfNextDay(date),
				countryName: countryName,
				countries: this.getCountriesForPicker(),
				townName: townsPicker.townName,
				towns: townsPicker.pickerItems,
				typeOfBudget: typesOfBudget[0],
				arrivalDateTimePickerVisible: false,
				departureDateTimePickerVisible: false,
				switchOn: townsPicker.townName === "" ? true : false,
				updateLegsOfTrip: params.updateLegsOfTrip,
				disableTouch: false,
				feedback: undefined,
				isEditable: true
			};
		} else {
			const isEditable = this.props.navigation.getParam("isEditable", true);
			const legOfTrip = params.legOfTrip;
			const townsPicker = this.getTownsForPicker(legOfTrip.countryName);
			const typeOfBudget = typesOfBudget.find(typeOfBudget => {
				{
					if (typeOfBudget.value === legOfTrip.typeOfBudget) {
						return typeOfBudget;
					}
				}
			});

			return {
				navBarTitle: "Étape du voyage",
				dateOfArrival: legOfTrip.dateOfArrival,
				dateOfDeparture: legOfTrip.dateOfDeparture,
				countryName: legOfTrip.countryName,
				countries: this.getCountriesForPicker(),
				townName: legOfTrip.townName,
				towns: townsPicker.pickerItems,
				typeOfBudget: typeOfBudget,
				arrivalDateTimePickerVisible: false,
				departureDateTimePickerVisible: false,
				switchOn: townsPicker.townName === "" ? true : false,
				updateLegsOfTrip: isEditable === true ? params.updateLegsOfTrip : undefined,
				index: isEditable === true ? params.index : undefined,
				disableTouch: false,
				feedback: undefined,
				isEditable: isEditable
			};
		}
	};

	getCountriesForPicker = () => {
		let pickerItems = [];
		const countries = getObjects("Country").sorted("name");

		countries.forEach(country => {
			pickerItems.push(<Picker.Item key={country.name} label={country.name} value={country.name} />);
		});

		return pickerItems;
	};

	getTownsForPicker = countryName => {
		let pickerItems = [];
		const request = "country.name='" + countryName + "'";
		const towns = getObjectsFiltered("Town", request);
		let townName = "";

		towns.forEach(town => {
			pickerItems.push(<Picker.Item key={town.name} label={town.name} value={town.name} />);
		});

		if (towns.length !== 0) {
			townName = towns[0].name;
		}

		return { pickerItems: pickerItems, townName: townName };
	};

	getDateOfNextDay = date => {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
	};

	arrivalHandleDataPicked = date => {
		if (date - this.state.dateOfDeparture > 0) {
			this.setState({
				dateOfArrival: date,
				dateOfDeparture: this.getDateOfNextDay(date),
				arrivalDateTimePickerVisible: false
			});
		} else {
			this.setState({ dateOfArrival: date, arrivalDateTimePickerVisible: false });
		}
	};

	departureHandleDatePicked = date => {
		this.setState({ dateOfDeparture: date, departureDateTimePickerVisible: false });
	};

	saveOrUpdate = () => {
		if (this.state.townName !== "") {
			this.state.updateLegsOfTrip(
				{
					dateOfArrival: this.state.dateOfArrival,
					dateOfDeparture: this.state.dateOfDeparture,
					countryName: this.state.countryName,
					townName: this.state.townName,
					typeOfBudget: this.state.typeOfBudget.value
				},
				this.state.index
			);
			this.props.navigation.goBack();
		} else {
			this.setState({
				feedback: {
					type: "error",
					title: "Ajout impossible",
					text: "Tous les champs obligatoires n'ont pas été remplis"
				}
			});
			setTimeout(() => {
				this.setState({
					feedback: undefined
				});
			}, 2000);
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
				<NavBarComponent title={this.state.navBarTitle} backButton={true} />
				<View style={{ flex: 1 }}>
					<DateTimePicker
						isVisible={this.state.arrivalDateTimePickerVisible}
						onConfirm={this.arrivalHandleDataPicked}
						onCancel={() => {
							this.setState({ arrivalDateTimePickerVisible: false });
						}}
						minimumDate={new Date()}
					/>
					<DateTimePicker
						isVisible={this.state.departureDateTimePickerVisible}
						onConfirm={this.departureHandleDatePicked}
						onCancel={() => {
							this.setState({ departureDateTimePickerVisible: false });
						}}
						minimumDate={this.getDateOfNextDay(this.state.dateOfArrival)}
					/>
					<ScrollView>
						<Divider styleName="section-header custom-divider">
							<Caption>Date d'arrivée</Caption>
						</Divider>
						<View styleName="horizontal">
							<TextInput
								styleName="small-height"
								style={{ flex: 0.7, marginLeft: 25, marginRight: 5 }}
								value={getDateToString(this.state.dateOfArrival)}
								editable={false}
							/>
							<TouchableOpacity
								disabled={!this.state.isEditable}
								style={{ flex: 0.3 }}
								onPress={() => {
									this.setState({ arrivalDateTimePickerVisible: true });
								}}
							>
								<Icon name="events" />
							</TouchableOpacity>
						</View>

						<View style={{ marginTop: 25 }}>
							<Divider styleName="section-header custom-divider">
								<Caption>Date de départ</Caption>
							</Divider>
							<View styleName="horizontal">
								<TextInput
									styleName="small-height"
									style={{ flex: 0.7, marginLeft: 25, marginRight: 5 }}
									value={getDateToString(this.state.dateOfDeparture)}
									editable={false}
								/>
								<TouchableOpacity
									disabled={!this.state.isEditable}
									style={{ flex: 0.3 }}
									onPress={() => {
										this.setState({ departureDateTimePickerVisible: true });
									}}
								>
									<Icon name="events" />
								</TouchableOpacity>
							</View>
						</View>

						<View style={{ marginTop: 25, alignItems: "center" }}>
							<Divider styleName="section-header custom-divider">
								<Caption>Nom du pays</Caption>
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
									enabled={this.state.isEditable}
									style={{
										flex: 1
									}}
									selectedValue={this.state.countryName}
									onValueChange={(itemValue, itemIndex) => {
										const townsPicker = this.getTownsForPicker(itemValue);
										this.setState({
											countryName: itemValue,
											townName: townsPicker.townName,
											towns: townsPicker.pickerItems,
											switchOn: townsPicker.townName === "" ? true : false
										});
									}}
								>
									{this.state.countries}
								</Picker>
							</View>
						</View>

						<View style={{ marginTop: 25, alignItems: "center" }}>
							<Divider styleName="section-header custom-divider">
								<Caption>Nom de la ville</Caption>
							</Divider>
							<Text style={{ marginTop: 5 }}>Entrez vous-même le nom de la ville ?</Text>
							<Switch
								disabled={!this.state.isEditable}
								onValueChange={value => {
									if (this.state.isEditable) {
										this.setState({ switchOn: value });
										if (value === false && this.state.towns.length !== 0) {
											this.setState({ townName: this.state.towns[0].key });
										}
									} else {
										this.setState({ switchOn: this.state.switchOn });
									}
								}}
								value={this.state.switchOn}
							/>
							{this.state.switchOn ? (
								<View styleName="horizontal">
									<TextInput
										editable={this.state.isEditable}
										styleName="small-height"
										style={{ flex: 0.7, marginLeft: 25, marginRight: 5 }}
										value={this.state.townName}
										placeholder={"Exemple : *Mdp19Fort/"}
										onChangeText={townName => this.setState({ townName: townName })}
									/>
									{this.state.townName !== "" ? (
										<Icon style={{ flex: 0.3, color: "green" }} name="checkbox-on" />
									) : (
										<Icon style={{ flex: 0.3, color: "red" }} name="error" />
									)}
								</View>
							) : (
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
										enabled={this.state.isEditable}
										style={{
											flex: 1
										}}
										selectedValue={this.state.townName}
										onValueChange={(itemValue, itemIndex) => this.setState({ townName: itemValue })}
									>
										{this.state.towns}
									</Picker>
								</View>
							)}
						</View>

						<View style={{ marginTop: 25, alignItems: "center" }} accessible={this.state.isEditable}>
							<Divider styleName="section-header custom-divider">
								<Caption>Type de budget</Caption>
							</Divider>
							<SegmentedControls
								tint={"black"}
								selectedTint={"white"}
								backTint={"white"}
								optionStyle={{
									fontSize: 11,
									fontWeight: "bold"
								}}
								separatorWidth={0}
								containerStyle={{
									borderColor: "lightgrey",
									marginTop: 15,
									marginLeft: 20,
									marginRight: 20,
									borderRadius: 20
								}}
								optionContainerStyle={{ height: 35, justifyContent: "center" }}
								options={typesOfBudget}
								onSelection={typeOfBudget => {
									if (this.state.isEditable === true) {
										this.setState({
											typeOfBudget: typeOfBudget
										});
									} else {
										this.setState({
											typeOfBudget: this.state.typeOfBudget
										});
									}
								}}
								selectedOption={this.state.typeOfBudget}
								extractText={option => option.label}
							/>
						</View>

						<View style={{ marginTop: 35, marginBottom: 20, alignItems: "center" }}>
							{this.state.isEditable === true ? (
								<Button
									disabled={this.state.disableTouch}
									styleName="connect"
									onPress={() => {
										this.disableTouch();
										this.saveOrUpdate();
									}}
								>
									<Text>Valider</Text>
									<Icon name="checkbox-on" />
								</Button>
							) : null}
						</View>
					</ScrollView>
				</View>
				{/* Composant permettant l'affichage des messages d'erreurs ou de succès */}
				<DropdownAlertComponent feedbackProps={this.state.feedback} />
			</View>
		);
	}
}
