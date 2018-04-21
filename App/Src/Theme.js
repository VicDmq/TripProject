import { getTheme } from "@shoutem/ui";
import { _ } from "lodash";
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
		".small-headband": {
			backgroundColor: "black",
			alignItems: "center",
			justifyContent: "center",
			height: 22,
			"shoutem.ui.Title": {
				color: "white",
				fontWeight: "bold",
				fontSize: 13,
				lineHeight: 15
			}
		},
		".modal-view": {
			height: 300,
			width: 300,
			borderRadius: 20,
			borderColor: "black",
			borderWidth: 2,
			alignItems: "center"
		},
		".modal-view-title": {
			borderBottomColor: "lightgrey",
			borderBottomWidth: 1,
			width: 250,
			alignItems: "center",
			justifyContent: "center",
			height: 40,
			"shoutem.ui.Title": {
				fontSize: 18,
				lineHeight: 20,
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
		".blue-button": {
			backgroundColor: "blue",
			height: 40,
			width: 150
		},
		".rounded-button": {
			backgroundColor: "black",
			height: 55,
			width: 55,
			borderRadius: 50
		},
		".small-button": {
			backgroundColor: "black",
			height: 25,
			width: 90,
			borderRadius: 7,
			".shoutem.ui.Text": {
				fontSize: 8,
				lineHeight: 12
			}
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
		},
		".label-value-divider": {
			backgroundColor: "white",
			borderBottomColor: "lightgrey",
			borderTopWidth: 0,
			borderBottomWidth: 2,
			paddingBottom: 3,
			width: 280,
			"shoutem.ui.Text": {
				".left-component": {
					marginLeft: 10,
					fontSize: 16
				},
				".right-component": {
					marginRight: 10,
					fontWeight: "bold",
					fontSize: 16,
					width: 150,
					textAlign: "right"
				}
			}
		}
	},
	"shoutem.ui.ImageBackground": {
		".image-home": {
			flex: 1,
			"shoutem.ui.Overlay": {
				flex: 0.8,
				width: 380,
				paddingTop: 20,
				"shoutem.ui.Title": {
					fontWeight: "bold",
					fontSize: 35,
					lineHeight: 40
				},
				"shoutem.ui.Subtitle": {
					".leg-of-trips": {
						fontSize: 15
					},
					".period": {
						fontSize: 11
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
				},
				".center": {
					justifyContent: "center"
				},
				".start": {
					justifyContent: "flex-start"
				}
			}
		}
	},
	"shoutem.ui.TouchableOpacity": {
		".custom": {
			activeOpacity: 0.4,
			borderBottomColor: "lightgrey",
			borderBottomWidth: 2,
			"shoutem.ui.Row": {
				height: 80,
				"shoutem.ui.View": {
					height: 60,
					justifyContent: "center",
					"shoutem.ui.Subtitle": {
						fontSize: 19,
						lineHeight: 25,
						fontWeight: "bold",
						marginBottom: 4
					},
					"shoutem.ui.Text": {
						fontSize: 9,
						margin: 0
					}
				}
			}
		}
	}
};

//On exporte le theme
//On utilise merge (lodash) : permet de merge le thème original fourni par Shoutem ui et celui ci-dessus
export const theme = _.merge(getTheme(), customTheme);
