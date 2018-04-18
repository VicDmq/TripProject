import React, { Component } from "react";
import { Picker } from "react-native";
import {
	Button,
	ImageBackground,
	Overlay,
	Divider,
	Card,
	Image,
	View,
	Subtitle,
	Text,
	Caption,
	GridRow,
	ListView,
	Title
} from "@shoutem/ui";
import Icon from "react-native-vector-icons/FontAwesome";
import ProgressBar from "react-native-progress/Bar";

import NavBarComponent from "../Components/NavBar";
import SpinnerComponent from "../Components/Spinner";
import { getConnectedUser } from "../../DataAccess/ObjectsRepositories/UserRepository";
import { getTrip } from "../../DataAccess/ObjectsRepositories/TripRepository";
import { getCurrencyByCode } from "../../DataAccess/ObjectsRepositories/CurrencyRepository";
import { convertToUserCurrency } from "../../Functions";

export default class BudgetScreen extends Component {
	constructor(props) {
		super(props);
		this.state = this.updateStateFromProps();
	}

	updateStateFromProps = () => {
		const { params } = this.props.navigation.state;
		const isEditable = this.props.navigation.getParam("isEditable", false);

		const user = getConnectedUser(params.userTokens.login, params.userTokens.password);
		const trip = getTrip(
			user,
			params.tripStateForAuth.title,
			params.tripStateForAuth.dateOfArrival,
			params.tripStateForAuth.dateOfDeparture
		);

		const legsOfTripbudgets = this.getlegsOfTripBudgetsFromTrip(trip, user.currency);

		let pickerItems = [];
		legsOfTripbudgets.forEach(legOfTrip => {
			pickerItems.push(<Picker.Item key={legOfTrip.townName} label={legOfTrip.townName} value={legOfTrip} />);
		});

		return {
			userTokens: params.userTokens,
			currencySymbol: user.currency.symbol,
			tripStateForAuth: params.tripStateForAuth,
			legsOfTripbudgets: legsOfTripbudgets,
			legsOfTripPicker: pickerItems,
			legOfTripSelected: legsOfTripbudgets[0],
			isEditable: isEditable
		};
	};

	getlegsOfTripBudgetsFromTrip = (trip, userCurrency) => {
		const legsOfTripbudgets = [];

		trip.legsOfTrip.forEach(legOfTrip => {
			const budgets = [
				{
					category: undefined,
					name: "Budget total",
					budgetSpent: convertToUserCurrency(
						legOfTrip.budget.totalBudgetSpent,
						userCurrency,
						legOfTrip.town.country.currency
					),
					budgetPlanned: convertToUserCurrency(
						legOfTrip.budget.totalBudgetPlanned,
						userCurrency,
						legOfTrip.town.country.currency
					)
				}
			];

			const budgetsByCategoryInFrench = {
				Food: "Alimentation",
				Housing: "Logement",
				Transport: "Transport",
				LeisureActivities: "Loisirs",
				Shopping: "Shopping",
				Sightseeing: "Tourisme"
			};

			legOfTrip.budget.budgetsByCategory.forEach(budgetByCategory => {
				budgets.push({
					category: budgetByCategory.category,
					name: budgetsByCategoryInFrench[budgetByCategory.category],
					budgetSpent: convertToUserCurrency(
						budgetByCategory.budgetSpent,
						userCurrency,
						legOfTrip.town.country.currency
					),
					budgetPlanned: convertToUserCurrency(
						budgetByCategory.budgetPlanned,
						userCurrency,
						legOfTrip.town.country.currency
					)
				});
			});

			legsOfTripbudgets.push({
				townName: legOfTrip.town.name,
				currencyCode: legOfTrip.town.country.currency.code,
				dateOfArrival: legOfTrip.dateOfArrival,
				dateOfDeparture: legOfTrip.dateOfDeparture,
				typeOfBudget: legOfTrip.budget.typeOfBudget,
				budgets: budgets
			});
		});

		return legsOfTripbudgets;
	};

	getRatioForProgressBar = (budgetSpent, budgetPlanned) => {
		let ratio = 0;
		if (budgetPlanned === 0 && budgetSpent !== 0) {
			ratio = 1;
		} else if (budgetPlanned !== 0) {
			ratio = budgetSpent / budgetPlanned;
		}
		return ratio;
	};

	renderRow = (rowData, sectionId, index) => {
		if (index === "0") {
			const budgetRatio = this.getRatioForProgressBar(rowData[0].budgetSpent, rowData[0].budgetPlanned);
			return (
				<View style={{ width: 360, height: 280 }}>
					<ImageBackground styleName={"image-home"} source={require("../Images/map.jpg")}>
						<Overlay styleName="image-overlay start" style={{ width: 360, height: 220 }}>
							<Title>{rowData[0].name}</Title>
							<Subtitle styleName="period">Type de budget : {this.state.legOfTripSelected.typeOfBudget}</Subtitle>
							<Text styleName="value" style={{ marginTop: 18 }}>
								{rowData[0].budgetSpent} {this.state.currencySymbol} / {rowData[0].budgetPlanned}{" "}
								{this.state.currencySymbol}
							</Text>
							<ProgressBar
								progress={budgetRatio}
								style={{ marginTop: 5 }}
								color={budgetRatio >= 1 ? "red" : "lightgreen"}
								width={225}
								height={18}
								borderRadius={20}
								borderColor={"white"}
								borderWidth={2}
							/>
							<Button
								style={{ marginTop: 25, height: 38 }}
								onPress={() => {
									this.props.navigation.navigate("HomeUpdateBudget", {
										userTokens: this.state.userTokens,
										legOfTrip: this.state.legOfTripSelected
									});
								}}
							>
								<Text style={{ marginRight: 20 }}>Modifier mes prévisions</Text>
								<Icon name="money" color="white" size={22} />
							</Button>
						</Overlay>
					</ImageBackground>
				</View>
			);
		}

		const cellViews = rowData.map((budget, id) => {
			const budgetRatio = this.getRatioForProgressBar(budget.budgetSpent, budget.budgetPlanned);
			return (
				<Card styleName="flexible">
					<View styleName="content">
						<View styleName="small-headband">
							<Title>{budget.name}</Title>
						</View>
						<View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
							<Text style={{ fontSize: 9 }}>
								{budget.budgetSpent} {this.state.currencySymbol} / {budget.budgetPlanned} {this.state.currencySymbol}
							</Text>
							<ProgressBar
								progress={budgetRatio}
								style={{ marginTop: 5 }}
								color={budgetRatio >= 1 ? "red" : "lightgreen"}
								width={120}
								height={12}
								borderRadius={20}
								borderColor={budgetRatio >= 1 ? "red" : "lightgreen"}
								borderWidth={1}
							/>
							<Button styleName={"small-button"} style={{ marginTop: 7 }}>
								<Text>Dépenses</Text>
							</Button>
						</View>
					</View>
				</Card>
			);
		});

		return <GridRow columns={2}>{cellViews}</GridRow>;
	};

	groupDataByRows = () => {
		let isFirstArticle = true;
		return GridRow.groupByRows(this.state.legOfTripSelected.budgets, 2, () => {
			if (isFirstArticle) {
				isFirstArticle = false;
				return 2;
			}
			return 1;
		});
	};

	render() {
		if (this.state.userTokens === undefined) {
			return <SpinnerComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<NavBarComponent title={"Mon budget"} backButton={true} />
					<View style={{ flex: 1, alignItems: "center" }}>
						<View
							style={{
								height: 30,
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
								selectedValue={this.state.legOfTripSelected}
								onValueChange={(itemValue, itemIndex) => this.setState({ legOfTripSelected: itemValue })}
							>
								{this.state.legsOfTripPicker}
							</Picker>
						</View>

						<View style={{ flex: 1, marginTop: 15 }}>
							<ListView data={this.groupDataByRows()} renderRow={this.renderRow} />
						</View>
					</View>
				</View>
			);
		}
	}
}
