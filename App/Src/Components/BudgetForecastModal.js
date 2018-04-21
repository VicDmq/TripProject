import React, { Component } from "react";
import { Modal } from "react-native";
import { View, Text, Button, Title, Icon } from "@shoutem/ui";

export default class BudgetForecastModalComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hideModal: props.hideModal,
			isVisible: props.isVisible,
			title: undefined,
			statistics: undefined
		};
	}

	UNSAFE_componentWillReceiveProps() {
		setTimeout(() => {
			this.setState({
				isVisible: this.props.isVisible,
				title: this.props.budgetForecast.name,
				statistics: this.props.budgetForecast.statistics
			});
			console.log(this.state.statistics);
		}, 100);
	}

	render() {
		return (
			<Modal visible={this.state.isVisible} transparent={true} animationType="slide">
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "transparent" }}
					transparent={true}
				>
					<View styleName="modal-view">
						{this.state.title !== undefined ? (
							<View styleName="modal-view-title">
								<Title>{this.state.title}</Title>
							</View>
						) : null}
						{this.state.statistics !== undefined ? (
							<View styleName="space-between" style={{ marginTop: 10, flex: 1 }}>
								<Text>Budget moyen dépensé : {this.state.statistics.avgBudgetSpent}</Text>
								<Text>Budget moyen plannifié : {this.state.statistics.avgBudgetPlanned}</Text>
								<Text>Budget minimal dépensé : {this.state.statistics.maxBudgetSpent}</Text>
								<Text>Budget maximal dépensé : {this.state.statistics.minBudgetSpent}</Text>
								<Text>Erreur moyenne avec les prévisions : {this.state.statistics.stdErrorWithForecast}</Text>
								<Text>Nombre d'utilisateurs : {this.state.statistics.numberOfForecast}</Text>
							</View>
						) : null}
						<Button
							styleName="rounded-button"
							onPress={() => {
								this.state.hideModal();
							}}
						>
							<Icon name="close" />
						</Button>
					</View>
				</View>
			</Modal>
		);
	}
}
