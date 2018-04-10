import { getTheme } from "@shoutem/ui";
import { _ } from "lodash";

//Fichier utilisé pour établir le thème des composants shoutem : évite de surcharger les composants
const customTheme = {
	"shoutem.ui.View": { backgroundColor: "white" },
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
	}
};

//On exporte le theme
//On utilise merge (lodash) : permet de merge le thème original fourni par Shoutem ui et celui ci-dessus
export const theme = _.merge(getTheme(), customTheme);
