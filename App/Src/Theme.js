import { getTheme } from "@shoutem/ui";
import { _ } from "lodash";

//On exporte le theme
//On utilise merge (lodash) : permet de merge le thème original fourni par Shoutem ui et celui ci-dessus
export const theme = _.merge(getTheme(), customTheme);

//Fichier utilisé pour établir le thème des composants shoutem : évite de surcharger les composants
const customTheme = {
	"shoutem.ui.View": {
		".headband": {
			backgroundColor: "black",
			alignItems: "center",
			justifyContent: "center",
			height: 50,
			"shoutem.ui.Title": {
				color: "white",
				fontWeight: "bold"
			}
		},
		backgroundColor: "white"
	},
	"shoutem.ui.TextInput": {
		".small-height": {
			height: 40,
			paddingBottom: 5
		},
		width: 220,
		borderBottomColor: "gray",
		borderBottomWidth: 1,
		selectionColor: "blue",
		paddingLeft: 10,
		paddingBottom: 0
	},
	"shoutem.ui.Button": {
		".connect": {
			backgroundColor: "green",
			height: 40,
			width: 150
		},
		".create-account": {
			backgroundColor: "black",
			height: 40,
			width: 150
		},
		"shoutem.ui.Text": {
			color: "white",
			fontSize: 12
		},
		"shoutem.ui.Icon": {
			color: "white"
		},
		borderRadius: 10
	},
	"shoutem.ui.Caption": {
		".error-label": {
			color: "red",
			marginTop: 10
		}
	},
	"shoutem.ui.Divider": {
		".custom-divider": {
			"shoutem.ui.Caption": {
				color: "white",
				fontWeight: "bold"
			},
			height: 34,
			paddingTop: 13,
			backgroundColor: "black",
			marginBottom: 5,
			borderColor: "black"
		}
	},
	"shoutem.ui.ImageBackground": {
		".image-home": {
			flex: 1,
			"shoutem.ui.Overlay.custom": {
				flex: 0.8,
				width: 380,
				paddingTop: 20,
				justifyContent: "flex-start",
				"shoutem.ui.Title": {
					fontWeight: "bold",
					fontSize: 35,
					lineHeight: 35
				},
				"shoutem.ui.Subtitle": {
					".leg-of-trips": {
						fontSize: 15
					},
					".period": {
						fontSize: 11,
						fontWeight: "Italic"
					}
				},
				"shoutem.ui.Text": {
					".value": {
						fontSize: 20,
						fontWeight: "bold"
					},
					".legend": {
						fontSize: 10
					}
				},
				"shoutem.ui.Button": {
					backgroundColor: "rgba(0, 0, 0, 0.6)",
					opacity: 0.9,
					width: 250,
					borderRadius: 20,
					"shoutem.ui.Text": {
						color: "white",
						fontWeight: "bold",
						fontSize: 14
					}
				}
			}
		}
	}
};
