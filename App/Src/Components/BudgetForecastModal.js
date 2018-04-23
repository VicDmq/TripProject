import React, { Component } from "react";
import { Modal } from "react-native";
import { View, Text, Button, Title, Icon } from "@shoutem/ui";

//Modal affiché pour avoir accès aux prévisions d'une catégorie
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

	//Fonction se déclenchant lorsque this.props est changé
	UNSAFE_componentWillReceiveProps() {
		//On attend 100ms, sinon this.props est encore vide (contenu asynchronisé)
		setTimeout(() => {
			this.setState({
				isVisible: this.props.isVisible,
				title: this.props.budgetForecast ? this.props.budgetForecast.name : undefined,
				statistics: this.props.budgetForecast ? this.props.budgetForecast.statistics : undefined
			});
		}, 100);
	}

	render() {
		return (
			<Modal visible={this.state.isVisible} transparent={true} animationType="slide">
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "transparent" }}
					transparent={true}
				>
					{/* Nom de la catégorie du budget  */}
					<View styleName="modal-view">
						{this.state.title !== undefined ? (
							<View styleName="modal-view-title">
								<Title>{this.state.title}</Title>
							</View>
						) : null}
						{/* S'il existe des statistiques, on les affiche  */}
						{this.state.statistics !== undefined && this.state.statistics.statisticsAreDefined === true ? (
							<View styleName="space-between" style={{ marginTop: 10, flex: 1, marginLeft: 10, marginRight: 10 }}>
								<Text>Budget moyen dépensé : {this.state.statistics.avgBudgetSpent}</Text>
								<Text>Budget moyen plannifié : {this.state.statistics.avgBudgetPlanned}</Text>
								<Text>Budget minimal dépensé : {this.state.statistics.maxBudgetSpent}</Text>
								<Text>Budget maximal dépensé : {this.state.statistics.minBudgetSpent}</Text>
								<Text>Écart type : {this.state.statistics.stdDeviation}</Text>
								<Text>Différence avec les prévisions : {this.state.statistics.stdErrorWithForecast} %</Text>
								<Text>Nombre d'utilisateurs : {this.state.statistics.numberOfForecast}</Text>
							</View>
						) : (
							<View
								style={{ flex: 1, alignItems: "center", justifyContent: "center", marginLeft: 10, marginRight: 10 }}
							>
								<Text style={{ textAlign: "center" }}>Pas de statistiques disponibles pour cette catégorie</Text>
							</View>
						)}
						{/* Bouton pour fermer le modal */}
						<Button
							styleName="rounded-button"
							style={{ marginTop: 10, marginBottom: 10 }}
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
