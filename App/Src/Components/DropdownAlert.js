import React, { Component } from "react";
//Module permettant d'afficher des messages suite aux actions de l'utilisateur
import DropdownAlert from "react-native-dropdownalert";

export default class DropdownAlertComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feedback: props.feedbackProps
		};
	}

	//Affichage d'un message une seule fois
	writeFeedback = () => {
		if (this.state.feedback !== undefined) {
			this.dropdown.alertWithType(this.state.feedback.type, this.state.feedback.title, this.state.feedback.text);
			this.setState({ feedback: undefined });
		}
	};

	//Se produit lorsque le composant vient d'être affiché : utilisé à l'initialisation
	componentDidMount() {
		this.writeFeedback();
	}

	//Se produit lorsque le composant vient d'être mis à jour
	componentDidUpdate() {
		this.writeFeedback();
	}

	//Se produit lorsque le composant reçoit de nouvelles données
	//UNSAFE car cette méthode va être bientôt modifié par ReactNative
	UNSAFE_componentWillReceiveProps() {
		//On attend un peu avant d'afficher le message : meilleur pour les fps et permet d'attendre que props soit défini
		setTimeout(() => {
			this.setState({ feedback: this.props.feedbackProps });
		}, 200);
	}

	render() {
		return (
			<DropdownAlert
				successImageSrc={require("../Images/checked.png")}
				closeInterval={3500}
				updateStatusBar={false}
				defaultContainer={{
					marginLeft: 8,
					marginRight: 8,
					marginTop: 8,
					padding: 8,
					flexDirection: "row",
					borderRadius: 50
				}}
				ref={ref => {
					this.dropdown = ref;
				}}
			/>
		);
	}
}
