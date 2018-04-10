import React, { Component } from "react";
import { TouchableHighlight, Modal } from "react-native";
import { View, Title, Icon, Text, TouchableOpacity, Button } from "@shoutem/ui";

export default class MessageBoxModalComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			compteur: 1
		};
	}

	setModalVisible(visible) {
		this.setState({ modalVisible: visible });
	}

	render() {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						alert("Modal has been closed.");
					}}
				>
					<View style={{ width: 300, height: 50, alignItems: "center", backgroundColor: "gray", borderRadius: 10 }}>
						<Text>Hello World!</Text>

						<TouchableHighlight
							onPress={() => {
								this.setModalVisible(!this.state.modalVisible);
							}}
						>
							<Text>Hide Modal</Text>
						</TouchableHighlight>
					</View>
				</Modal>
				<Button
					styleName="connect"
					onPress={() => {
						this.setModalVisible(true);
					}}
				>
					<Text>Show Modal</Text>
				</Button>
				<View style={{ marginTop: 35, marginBottom: 20, alignItems: "center" }}>
					<Button
						styleName="connect"
						onPress={() => {
							this.setState({ compteur: this.state.compteur + 1 });
						}}
					>
						<Text>hey{this.state.compteur}</Text>
					</Button>
				</View>
			</View>
		);
	}
}
