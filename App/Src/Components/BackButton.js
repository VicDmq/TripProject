import React, { Component } from "react";
import { Icon, TouchableOpacity, View, Overlay, Button } from "@shoutem/ui";
import { withNavigation } from "react-navigation";

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

export default withNavigation(BackButtonComponent);
