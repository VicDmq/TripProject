import React, { Component } from "react";
import { Icon, TouchableOpacity, View, Overlay, Button } from "@shoutem/ui";
import { withNavigation } from "react-navigation";

//Bouton affiché sur la barre de navigation : permet de retourner sur la page précédente
class BackButtonComponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Button
				onPress={() => {
					this.props.navigation.goBack();
				}}
			>
				<Overlay styleName="rounded-small image-overlay">
					<Icon name="back" style={{ color: "white" }} />
				</Overlay>
			</Button>
		);
	}
}

//Nécessaire pour avoir accès à la props "navigation"
export default withNavigation(BackButtonComponent);
