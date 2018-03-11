const Realm = require("realm");
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
