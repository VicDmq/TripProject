import React, { Component } from "react";
import { View, Divider, TextInput, TouchableOpacity, Icon, Caption, ListView } from "@shoutem/ui";

import SpinnerComponent from "../Components/Spinner";
import NavBarComponent from "../Components/NavBar";
import DropdownAlertComponent from "../Components/DropdownAlert";
import { getBudgetForecastByCategory } from "../../DataAccess/ObjectsRepositories/BudgetForecastRepository";

export default class UpdateBudgetScreen extends Component {
	constructor(props) {
		super(props);
		this.state = this.updateStateFromProps();
	}

	updateStateFromProps = () => {
		const { params } = this.props.navigation.state;

		const budgets = [];

		params.legOfTrip.budgets.forEach(budget => {
			if (budget.category !== undefined) {
				budgets.push({
					category: budget.category,
					name: budget.name,
					budgetPlanned: budget.budgetPlanned.toString(),
					budgetForecast: getBudgetForecastByCategory(
						params.legOfTrip.townName,
						budget.category,
						params.legOfTrip.typeOfBudget
					)
				});
			}
		});

		return {
			userTokens: params.userTokens,
			legOfTrip: {
				townName: params.legOfTrip.townName,
				dateOfArrival: params.legOfTrip.dateOfArrival,
				dateOfDeparture: params.legOfTrip.dateOfDeparture,
				currencyCode: params.legOfTrip.currencyCode
			},
			budgets: budgets,
			test: "0",
			feedback: undefined
		};
	};

	renderTextInputs = () => {
		const textInputs = [];

		this.state.budgets.forEach(budget => {
			const index = this.state.budgets.indexOf(budget);
			textInputs.push(
				<View>
					<Divider styleName="section-header custom-divider">
						<Caption>{budget.name}</Caption>
					</Divider>
					<View styleName="horizontal" style={{ marginBottom: 15 }}>
						<TextInput
							keyboardType="numeric"
							styleName="small-height"
							style={{ flex: 0.7, marginLeft: 25, marginRight: 5 }}
							value={this.state.test}
							onChangeText={text => {
								this.setState({
									test: text
								});
							}}
						/>
						<TouchableOpacity style={{ flex: 0.3 }} onPress={() => {}}>
							<Icon name="events" />
						</TouchableOpacity>
					</View>
				</View>
			);
		});

		return textInputs;
	};

	render() {
		console.log(this.state.budgets[0]);
		if (this.state.userTokens === undefined) {
			return <SpinnerComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<NavBarComponent title={"Modification budget"} backButton={true} />
					{this.renderTextInputs()}
					<DropdownAlertComponent feedbackProps={this.state.feedback} />
				</View>
			);
		}
	}
}
