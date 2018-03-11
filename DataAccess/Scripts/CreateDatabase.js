const Realm = require("realm");

import { realm } from "./Realm";
import { convertToUserCurrency, roundTo2Decimals } from "../Functions";

//Création d'un utilisateur
export const addUser = (login, password, lastName, firstName, location) => {
	let newUser = undefined;

	realm.write(() => {
		newUser = realm.create("User", {
			login: login,
			password: password,
			lastName: lastName,
			firstName: firstName,
			location: location //Pays où il habite : permet d'avoir sa devise
		});
	});

	return newUser; //Nécessaire de retourner un objet
};

//Création d'un voyage
export const addTrip = (user, legsOfTrip) => {
	if (legsOfTrip.length !== 0) {
		let dateOfArrival = legsOfTrip[0].dateOfArrival;
		let dateOfDeparture = legsOfTrip[0].dateOfDeparture;

		for (var i = 0; i < legsOfTrip.length; i++) {
			if (i > 0) {
				if (dateOfArrival > legsOfTrip[i].dateOfArrival) {
					dateOfArrival = legsOfTrip[i].dateOfArrival;
				}
				if (dateOfDeparture < legsOfTrip[i].dateOfDeparture) {
					dateOfDeparture = legsOfTrip[i].dateOfDeparture;
				}
			}

			realm.write(() => {
				legsOfTrip[i].valueOfLocalCurrency =
					legsOfTrip[i].town.country.currency.valueAgainstOneDollar / user.location.currency.valueAgainstOneDollar;
			});
		}

		realm.write(() => {
			const newTrip = realm.create("Trip", {
				dateOfArrival: dateOfArrival,
				dateOfDeparture: dateOfDeparture
			});

			newTrip.legsOfTrip = legsOfTrip;
			user.trips.push(newTrip);
		});
	}
};

export const addLegOfTrip = (dateOfArrival, dateOfDeparture, town) => {
	let newLegOfTrip = undefined;
	realm.write(() => {
		newLegOfTrip = realm.create("LegOfTrip", {
			dateOfArrival: dateOfArrival,
			dateOfDeparture: dateOfDeparture,
			town: town
		});
	});
	return newLegOfTrip;
};

export const addBudget = (legOfTrip, typeOfBudget) => {
	realm.write(() => {
		const newBudget = realm.create("Budget", {
			typeOfBudget: typeOfBudget
		});
		newBudget.budgetsByCategory.push({
			type: "budgetForTransport"
		});
		newBudget.budgetsByCategory.push({
			type: "budgetForHousing"
		});
		newBudget.budgetsByCategory.push({
			type: "budgetForFood"
		});
		newBudget.budgetsByCategory.push({
			type: "budgetForSightseeing"
		});
		newBudget.budgetsByCategory.push({
			type: "budgetForShopping"
		});
		newBudget.budgetsByCategory.push({
			type: "budgetForLeisureActivities"
		});

		legOfTrip.budget = newBudget;
	});
};

export const addExpenditure = (legOfTrip, type, price, justification) => {
	realm.write(() => {
		const newExpenditure = realm.create("Expenditure", {
			price: price,
			justification: justification
		});

		const budget = legOfTrip.budget;
		const budgetByCategory = budget.budgetsByCategory.filter(budgetByCategory => budgetByCategory.type === type)[0];

		budgetByCategory.expenditures.push(newExpenditure);
		budgetByCategory.budgetSpent += price;
		budget.totalBudgetSpent += price;
	});
};

export const addCountry = (name, currency) => {
	let newCountry = undefined;

	realm.write(() => {
		newCountry = realm.create("Country", {
			name: name,
			currency: currency
		});
	});

	return newCountry;
};

export const addTown = (name, country) => {
	let newTown = undefined;

	realm.write(() => {
		newTown = realm.create("Town", {
			name: name,
			country: country
		});

		const lowBudgetForecast = realm.create("BudgetForecast", {
			type: "lowBudget",
			statisticsFortotalBudget: {},
			statisticsForTransport: {},
			statisticsForHousing: {},
			statisticsForFood: {},
			statisticsForShopping: {},
			statisticsForSightseeing: {},
			statisticsForLeisureActivities: {}
		});
		newTown.budgetForecast.push(lowBudgetForecast);

		const mediumBudgetForecast = realm.create("BudgetForecast", {
			type: "mediumBudget",
			statisticsFortotalBudget: {},
			statisticsForTransport: {},
			statisticsForHousing: {},
			statisticsForFood: {},
			statisticsForShopping: {},
			statisticsForSightseeing: {},
			statisticsForLeisureActivities: {}
		});
		newTown.budgetForecast.push(mediumBudgetForecast);

		const highBudgetForecast = realm.create("BudgetForecast", {
			type: "highBudget",
			statisticsFortotalBudget: {},
			statisticsForTransport: {},
			statisticsForHousing: {},
			statisticsForFood: {},
			statisticsForShopping: {},
			statisticsForSightseeing: {},
			statisticsForLeisureActivities: {}
		});
		newTown.budgetForecast.push(highBudgetForecast);
	});

	return newTown;
};

export const addCurrency = (name, valueAgainstOneDollar) => {
	let newCurrency = undefined;

	realm.write(() => {
		newCurrency = realm.create("Currency", {
			name: name,
			valueAgainstOneDollar: valueAgainstOneDollar
		});
	});

	return newCurrency;
};

export const addToBudgets = (budget, budgetsForType, type, nbDay) => {
	const budgetForType = budget.budgetsByCategory.filter(budgetByCategory => budgetByCategory.type === type)[0];

	if (budgetForType.budgetSpent !== 0 || budgetForType.budgetPlanned !== 0) {
		budgetsForType.push({
			budgetPlanned: budgetForType.budgetPlanned / nbDay,
			budgetSpent: budgetForType.budgetSpent / nbDay
		});
	}
};

export const getStatisticsForBudget = budget => {
	if (budget.length !== 0) {
		let avgBudgetSpent = 0;
		let avgBudgetPlanned = 0;
		let minBudgetSpent = budget[0].budgetSpent;
		let maxBudgetSpent = 0;
		let stdDeviation = 0;
		let stdErrorWithForecast = 0;
		let numberOfForecast = 0;

		for (var i = 0; i < budget.length; i++) {
			const budgetSpent = budget[i].budgetSpent;
			const budgetPlanned = budget[i].budgetPlanned;

			avgBudgetSpent += budgetSpent;
			avgBudgetPlanned += budgetPlanned;
			if (budgetSpent < minBudgetSpent) {
				minBudgetSpent = budgetSpent;
			}
			if (budgetSpent > maxBudgetSpent) {
				maxBudgetSpent = budgetSpent;
			}
			stdErrorWithForecast += (budgetSpent - budgetPlanned) * 100 / budgetPlanned;
			numberOfForecast++;
		}
		avgBudgetSpent /= numberOfForecast;
		avgBudgetPlanned /= numberOfForecast;
		stdErrorWithForecast /= numberOfForecast;

		for (var i = 0; i < budget.length; i++) {
			const budgetSpent = budget[i].budgetSpent;
			stdDeviation += Math.pow(budgetSpent - avgBudgetSpent, 2);
		}
		stdDeviation /= numberOfForecast;

		avgBudgetSpent = roundTo2Decimals(avgBudgetSpent);
		avgBudgetPlanned = roundTo2Decimals(avgBudgetPlanned);
		minBudgetSpent = roundTo2Decimals(minBudgetSpent);
		maxBudgetSpent = roundTo2Decimals(maxBudgetSpent);
		stdDeviation = roundTo2Decimals(stdDeviation);
		stdErrorWithForecast = roundTo2Decimals(stdErrorWithForecast);

		return {
			statisticsAreDefined: true,
			avgBudgetSpent: avgBudgetSpent,
			avgBudgetPlanned: avgBudgetPlanned,
			minBudgetSpent: minBudgetSpent,
			maxBudgetSpent: maxBudgetSpent,
			stdDeviation: stdDeviation,
			stdErrorWithForecast: stdErrorWithForecast,
			numberOfForecast: numberOfForecast
		};
	} else {
		return {};
	}
};

export const updateBudgetForecastOfTown = town => {
	const legsOfTrip = realm
		.objects("LegOfTrip")
		.filtered('town.name = $0 AND budget.typeOfBudget="lowBudget"', town.name);

	const totalBudgets = [];
	const budgetsForTransport = [];
	const budgetsForHousing = [];
	const budgetsForFood = [];
	const budgetsForSightseeing = [];
	const budgetsForShopping = [];
	const budgetsForLeisureActivities = [];

	for (var i = 0; i < legsOfTrip.length; i++) {
		const budget = legsOfTrip[i].budget;
		const nbDay = Math.floor((legsOfTrip[i].dateOfDeparture - legsOfTrip[i].dateOfArrival) / 86400000);
		if (legsOfTrip[i].dateOfDeparture < new Date() && budget.totalBudgetSpent !== 0) {
			totalBudgets.push({
				budgetPlanned: budget.totalBudgetPlanned / nbDay,
				budgetSpent: budget.totalBudgetSpent / nbDay
			});
			addToBudgets(budget, budgetsForTransport, "budgetForTransport", nbDay);
			addToBudgets(budget, budgetsForHousing, "budgetForHousing", nbDay);
			addToBudgets(budget, budgetsForFood, "budgetForFood", nbDay);
			addToBudgets(budget, budgetsForSightseeing, "budgetForSightseeing", nbDay);
			addToBudgets(budget, budgetsForShopping, "budgetForShopping", nbDay);
			addToBudgets(budget, budgetsForLeisureActivities, "budgetForLeisureActivities", nbDay);
		}
	}

	realm.write(() => {
		const budgetForecast = town.budgetForecast.filter(budgetForecast => budgetForecast.type === "lowBudget")[0];

		budgetForecast.statisticsFortotalBudget = getStatisticsForBudget(totalBudgets);
		budgetForecast.statisticsForTransport = getStatisticsForBudget(budgetsForTransport);
		budgetForecast.statisticsForHousing = getStatisticsForBudget(budgetsForHousing);
		budgetForecast.statisticsForFood = getStatisticsForBudget(budgetsForFood);
		budgetForecast.statisticsForShopping = getStatisticsForBudget(budgetsForShopping);
		budgetForecast.statisticsForSightseeing = getStatisticsForBudget(budgetsForShopping);
		budgetForecast.statisticsForLeisureActivities = getStatisticsForBudget(budgetsForLeisureActivities);
	});
};

export const createDatabase = () => {
	clearDatabase();

	const euro = addCurrency("Euro", 0.81);
	const francCFA = addCurrency("Franc CFA", 533.34);

	const france = addCountry("France", euro);
	const senegal = addCountry("Sénégal", francCFA);

	const dakar = addTown("Dakar", senegal);
	const sali = addTown("Sali", senegal);

	const user = addUser("vicId", "vicPassw", "Domecq", "Victor", france);

	const legsOfTrip = [];
	legsOfTrip[0] = addLegOfTrip(new Date(2018, 1, 15), new Date(2018, 1, 18), dakar);
	legsOfTrip[1] = addLegOfTrip(new Date(2018, 1, 18), new Date(2018, 1, 21), sali);

	addBudget(legsOfTrip[0], "lowBudget");
	addBudget(legsOfTrip[1], "mediumBudget");

	addTrip(user, legsOfTrip);

	// price = convertToOtherCurrency(1569.56, legsOfTrip[0].valueOfLocalCurrency);
	addExpenditure(legsOfTrip[0], "budgetForFood", 2, "Bière");
	addExpenditure(legsOfTrip[0], "budgetForTransport", 1500, "Avion ");
	addExpenditure(legsOfTrip[0], "budgetForFood", 1, "Pain");
	addExpenditure(legsOfTrip[0], "budgetForFood", 0.4, "Chewing-gum");
	addExpenditure(legsOfTrip[0], "budgetForHousing", 756, "Villa");
	addExpenditure(legsOfTrip[0], "budgetForFood", 1.5, "Bière");

	updateBudgetForecastOfTown(dakar);
};

export const clearDatabase = () => {
	realm.write(() => {
		realm.delete(realm.objects("User"));
		realm.deleteAll();
	});
};
