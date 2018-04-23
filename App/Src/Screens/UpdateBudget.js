import React, { Component } from "react";
import { ScrollView } from "react-native";
import { View, Divider, TextInput, TouchableOpacity, Icon, Caption, Text, Button } from "@shoutem/ui";

import SpinnerComponent from "../Components/Spinner";
import NavBarComponent from "../Components/NavBar";
import DropdownAlertComponent from "../Components/DropdownAlert";
import BudgetForecastModalComponent from "../Components/BudgetForecastModal";

import { getBudgetForecastByCategory } from "../../DataAccess/ObjectsRepositories/BudgetForecastRepository";
import { getTownByNameAndCountryName } from "../../DataAccess/ObjectsRepositories/TownRepository";
import { getConnectedUser } from "../../DataAccess/ObjectsRepositories/UserRepository";

export default class UpdateBudgetScreen extends Component {
	constructor(props) {
		super(props);
		this.state = this.updateStateFromProps();
	}

	updateStateFromProps = () => {
		const { params } = this.props.navigation.state;

		const budgets = [];

		const user = getConnectedUser(params.userTokens.login, params.userTokens.password);

		params.legOfTrip.budgets.forEach(budget => {
			if (budget.category !== undefined) {
				budgets.push({
					category: budget.category,
					name: budget.name,
					budgetPlanned: budget.budgetPlanned,
					budgetForecast: getBudgetForecastByCategory(
						params.legOfTrip.townName,
						params.legOfTrip.countryName,
						budget.category,
						params.legOfTrip.typeOfBudget,
						user.currency
					)
				});
			}
		});

		return {
			updateBudgets: params.updateBudgets,
			currencySymbol: user.currency.symbol,
			budgets: budgets,
			modalIsVisible: false,
			modalProps: undefined,
			disableTouch: false
		};
	};

	onSave = () => {
		const budgets = this.state.budgets;
		this.state.updateBudgets(budgets);
		this.props.navigation.goBack();
	};

	renderTextInputs = () => {
		const textInputs = [];

		this.state.budgets.forEach(budget => {
			textInputs.push(
				<View>
					<Divider styleName="section-header custom-divider">
						<Caption>{budget.name}</Caption>
					</Divider>
					<View styleName="horizontal" style={{ marginBottom: 15 }}>
						<TextInput
							keyboardType="numeric"
							styleName="small-height"
							style={{ flex: 0.7, marginLeft: 50, marginRight: 15, textAlign: "center" }}
							value={budget.budgetPlanned.toString() + " " + this.state.currencySymbol}
							onChangeText={text => {
								const budgets = this.state.budgets;
								const index = budgets.indexOf(budget);
								const newBudgetPlanned = text.replace(/[^0-9]/g, "");
								budgets[index].budgetPlanned = parseInt(newBudgetPlanned) ? parseInt(newBudgetPlanned) : 0;
								this.setState({
									budgets: budgets
								});
							}}
						/>
						<TouchableOpacity
							style={{ flex: 0.3 }}
							onPress={() => {
								this.setState({
									modalIsVisible: true,
									modalProps: {
										name: budget.name,
										statistics: budget.budgetForecast
									}
								});
							}}
						>
							<Icon name="about" />
						</TouchableOpacity>
					</View>
				</View>
			);
		});

		return textInputs;
	};

	hideModal = () => {
		this.setState({ modalIsVisible: false });
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
		if (this.state.budgets === undefined) {
			return <SpinnerComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<NavBarComponent title={"Modification budget"} backButton={true} />
					<ScrollView>
						<BudgetForecastModalComponent
							isVisible={this.state.modalIsVisible}
							hideModal={this.hideModal}
							budgetForecast={this.state.modalProps}
						/>
						{this.renderTextInputs()}
						<View style={{ alignItems: "center", marginTop: 20, marginBottom: 20 }}>
							<Button
								disableTouch={this.state.disableTouch}
								styleName="connect"
								onPress={() => {
									this.disableTouch();
									this.onSave();
								}}
							>
								<Text>Sauvegarder</Text>
								<Icon name="checkbox-on" />
							</Button>
						</View>
					</ScrollView>
					<DropdownAlertComponent feedbackProps={this.state.feedback} />
				</View>
			);
		}
	}
}
