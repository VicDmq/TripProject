import React, { Component } from "react";
import { Spinner, View } from "@shoutem/ui";

export default class SpinnerComponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Spinner style={{ size: "large" }} />
			</View>
		);
	}
}
