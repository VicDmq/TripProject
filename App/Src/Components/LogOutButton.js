import React, { Component } from "react";
import { Icon, TouchableOpacity, View, Overlay, Button } from "@shoutem/ui";

import { withNavigation } from "react-navigation";

import { removeConnectedUser } from "../../DataAccess/ObjectsRepositories/UserRepository";

class LogOutButtonComponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Button
				onPress={() => {
					removeConnectedUser();
					this.props.navigation.navigate("AuthLoading");
				}}
				style={{ marginRight: 15 }}
			>
				<Overlay styleName="rounded-small image-overlay">
					<Icon name="turn-off" style={{ color: "white" }} />
				</Overlay>
			</Button>
		);
	}
}

export default withNavigation(LogOutButtonComponent);
