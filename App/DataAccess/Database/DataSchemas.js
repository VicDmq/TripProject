export const userSchema = {
	name: "User",
	properties: {
		login: "string",
		password: "string",
		lastName: "string",
		firstName: "string",
		currency: { type: "Currency" },
		trips: { type: "list", objectType: "Trip" }
	}
};

export const tripSchema = {
	name: "Trip",
	properties: {
		dateOfArrival: "date",
		dateOfDeparture: "date",
		legsOfTrip: { type: "list", objectType: "LegOfTrip" }
	}
};

export const legOfTripSchema = {
	name: "LegOfTrip",
	properties: {
		dateOfArrival: "date",
		dateOfDeparture: "date",
		town: { type: "Town" },
		budget: { type: "Budget" }
	}
};

export const budgetSchema = {
	name: "Budget",
	properties: {
		typeOfBudget: "string",
		totalBudgetPlanned: { type: "double", default: 0 },
		totalBudgetSpent: { type: "double", default: 0 },
		budgetsByCategory: { type: "list", objectType: "BudgetByCategory" }
	}
};

export const budgetByCategorySchema = {
	name: "BudgetByCategory",
	properties: {
		category: "string",
		budgetPlanned: { type: "double", default: 0 },
		budgetSpent: { type: "double", default: 0 },
		expenditures: { type: "list", objectType: "Expenditure" }
	}
};

export const expenditureSchema = {
	name: "Expenditure",
	properties: {
		date: { type: "date" },
		price: { type: "double" },
		justification: { type: "string", optional: true }
	}
};

export const countrySchema = {
	name: "Country",
	properties: {
		name: "string",
		currency: { type: "Currency" }
	}
};

export const townSchema = {
	name: "Town",
	properties: {
		name: "string",
		country: { type: "Country" },
		budgetForecast: { type: "list", objectType: "BudgetForecast" }
	}
};

export const budgetForecastSchema = {
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

export const statisticsForBudgetSchema = {
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

export const currencySchema = {
	name: "Currency",
	properties: {
		name: "string",
		symbol: "string",
		valueAgainstOneEuro: { type: "double", default: 1 }
	}
};
