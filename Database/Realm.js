const Realm = require("realm");

const userSchema = {
	name: "User",
	properties: {
		login: "string",
		password: "string",
		lastName: "string",
		firstName: "string",
		location: { type: "Country" },
		trips: { type: "list", objectType: "Trip" }
	}
};

const tripSchema = {
	name: "Trip",
	properties: {
		dateOfArrival: "date",
		dateOfDeparture: "date",
		legsOfTrip: { type: "list", objectType: "LegOfTrip" }
	}
};

const legOfTripSchema = {
	name: "LegOfTrip",
	properties: {
		dateOfArrival: "date",
		dateOfDeparture: "date",
		valueOfLocalCurrency: { type: "double", default: 1 },
		town: { type: "Town" },
		budget: { type: "Budget" }
	}
};

const budgetSchema = {
	name: "Budget",
	properties: {
		typeOfBudget: "string",
		totalBudgetPlanned: { type: "double", default: 0 },
		totalBudgetSpent: { type: "double", default: 0 },
		budgetsByCategory: { type: "list", objectType: "BudgetByCategory" }
	}
};

const budgetByCategorySchema = {
	name: "BudgetByCategory",
	properties: {
		type: "string",
		budgetPlanned: { type: "double", default: 0 },
		budgetSpent: { type: "double", default: 0 },
		expenditures: { type: "list", objectType: "Expenditure" }
	}
};

const expenditureSchema = {
	name: "Expenditure",
	properties: {
		date: { type: "date", default: new Date() },
		price: { type: "double", default: 0 },
		justification: { type: "string", optional: true }
	}
};

const countrySchema = {
	name: "Country",
	properties: {
		name: "string",
		currency: { type: "Currency" }
	}
};

const townSchema = {
	name: "Town",
	properties: {
		name: "string",
		country: { type: "Country" },
		budgetForecast: { type: "list", objectType: "BudgetForecast" }
	}
};

const budgetForecastSchema = {
	name: "BudgetForecast",
	properties: {
		type: "string",
		statisticsFortotalBudget: { type: "StatisticsForBudget" },
		statisticsForTransport: { type: "StatisticsForBudget" },
		statisticsForHousing: { type: "StatisticsForBudget" },
		statisticsForFood: { type: "StatisticsForBudget" },
		statisticsForShopping: { type: "StatisticsForBudget" },
		statisticsForSightseeing: { type: "StatisticsForBudget" },
		statisticsForLeisureActivities: { type: "StatisticsForBudget" }
	}
};

const statisticsForBudgetSchema = {
	name: "StatisticsForBudget",
	properties: {
		statisticsAreDefined: { type: "bool", default: false },
		avgBudgetSpent: { type: "double", optional: true },
		avgBudgetPlanned: { type: "double", optional: true },
		minBudgetSpent: { type: "double", optional: true },
		maxBudgetSpent: { type: "double", optional: true },
		stdDeviation: { type: "double", optional: true },
		stdErrorWithForecast: { type: "double", optional: true },
		numberOfForecast: { type: "double", optional: true }
	}
};

const currencySchema = {
	name: "Currency",
	properties: {
		name: "string",
		valueAgainstOneDollar: "double"
	}
};

export let realm = new Realm({
	path: "newRealm",
	schema: [
		userSchema,
		tripSchema,
		legOfTripSchema,
		budgetSchema,
		budgetByCategorySchema,
		expenditureSchema,
		countrySchema,
		town,
		budgetForecastSchema,
		statisticsForBudgetSchema,
		currencySchema
	],
	deleteRealmIfMigrationNeeded: true
});
