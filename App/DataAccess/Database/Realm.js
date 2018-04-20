const Realm = require("realm");
//Import des schémas définissant la structure (nom et propriétés) des objets
import {
	userSchema,
	tripSchema,
	legOfTripSchema,
	budgetSchema,
	budgetByCategorySchema,
	expenditureSchema,
	countrySchema,
	townSchema,
	budgetForecastSchema,
	statisticsForBudgetSchema,
	currencySchema
} from "./DataSchemas";

//Création de la base de donnée : on récupère un objet que l'on exporte par la suite
export const realm = new Realm({
	path: "newRealm",
	schema: [
		userSchema,
		tripSchema,
		legOfTripSchema,
		budgetSchema,
		budgetByCategorySchema,
		expenditureSchema,
		countrySchema,
		townSchema,
		budgetForecastSchema,
		statisticsForBudgetSchema,
		currencySchema
	],
	deleteRealmIfMigrationNeeded: true
});
