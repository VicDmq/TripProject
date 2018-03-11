import { createObject, addObjecToPropertyList, updateObjectProperty } from "../Scripts/UpdateDatabase";

export const addTown = (name, country) => {
	const properties = {
		name: name,
		country: country
	};

	const newTown = createObject("Town", properties);

	const propertiesForBudgetForecast = {
		type: "lowBudget",
		statisticsFortotalBudget: {},
		statisticsForTransport: {},
		statisticsForHousing: {},
		statisticsForFood: {},
		statisticsForShopping: {},
		statisticsForSightseeing: {},
		statisticsForLeisureActivities: {}
	};
	const lowBudgetForecast = createObject("BudgetForecast", propertiesForBudgetForecast);

	propertiesForBudgetForecast.type = "mediumBudget";
	const mediumBudgetForecast = createObject("BudgetForecast", propertiesForBudgetForecast);

	propertiesForBudgetForecast.type = "highBudget";
	const highBudgetForecast = createObject("BudgetForecast", propertiesForBudgetForecast);

	addObjecToPropertyList(newTown, "budgetForecast", lowBudgetForecast);
	addObjecToPropertyList(newTown, "budgetForecast", mediumBudgetForecast);
	addObjecToPropertyList(newTown, "budgetForecast", highBudgetForecast);

	return newTown;
};

export const updateTown = town => {
	updateBudgetForecast(town, "lowBudget");
	updateBudgetForecast(town, "mediumBudget");
	updateBudgetForecast(town, "highBudget");
};

const updateBudgetForecast = (town, typeOfBudget) => {
	const legsOfTrip = realm
		.objects("LegOfTrip")
		.filtered("town.name = $0 AND budget.typeOfBudget=$1", town.name, typeOfBudget);
	//Récupére toutes les étapes des voyageurs pour une ville et un type de budget donnés

	const totalBudgets = [];
	const budgetsForTransport = [];
	const budgetsForHousing = [];
	const budgetsForFood = [];
	const budgetsForSightseeing = [];
	const budgetsForShopping = [];
	const budgetsForLeisureActivities = [];
	//Tableaux dans lesquels on stocke tout les budgets pour un type donné (budget plannifié et dépensé)

	for (var i = 0; i < legsOfTrip.length; i++) {
		const budget = legsOfTrip[i].budget;
		const nbDay = Math.floor((legsOfTrip[i].dateOfDeparture - legsOfTrip[i].dateOfArrival) / 86400000);
		//Nb de jours passés nécessaires pour uniformiser les données

		//Se fait une fois le voyage terminé et si l'utilisateur a inséré des données
		if (legsOfTrip[i].dateOfDeparture < new Date() && budget.totalBudgetSpent !== 0) {
			totalBudgets.push({
				budgetPlanned: budget.totalBudgetPlanned / nbDay,
				budgetSpent: budget.totalBudgetSpent / nbDay
			});
			addToBudgetList(budget, budgetsForTransport, "Transport", nbDay);
			addToBudgetList(budget, budgetsForHousing, "Housing", nbDay);
			addToBudgetList(budget, budgetsForFood, "Food", nbDay);
			addToBudgetList(budget, budgetsForSightseeing, "Sightseeing", nbDay);
			addToBudgetList(budget, budgetsForShopping, "Shopping", nbDay);
			addToBudgetList(budget, budgetsForLeisureActivities, "LeisureActivities", nbDay);
		}
	} //Permet de remplir les tableaux ci-dessus

	const budgetForecast = town.budgetForecast.filter(budgetForecast => budgetForecast.type === "lowBudget")[0];

	updateObjectProperty(budgetForecast, "statisticsFortotalBudget", getStatisticsProperties(totalBudgets));
	updateObjectProperty(budgetForecast, "statisticsForTransport", getStatisticsProperties(budgetsForTransport));
	updateObjectProperty(budgetForecast, "statisticsForHousing", getStatisticsProperties(budgetsForHousing));
	updateObjectProperty(budgetForecast, "statisticsForFood", getStatisticsProperties(budgetsForFood));
	updateObjectProperty(budgetForecast, "statisticsForShopping", getStatisticsProperties(budgetsForShopping));
	updateObjectProperty(budgetForecast, "statisticsForSightseeing", getStatisticsProperties(budgetsForSightseeing));
	updateObjectProperty(
		budgetForecast,
		"statisticsForLeisureActivities",
		getStatisticsProperties(budgetsForLeisureActivities)
	);
};

const addToBudgetList = (budget, budgetsForType, category, nbDay) => {
	const budgetForType = budget.budgetsByCategory.filter(budgetByCategory => budgetByCategory.category === category)[0];
	//On récupère un budget(budgetForType) pour une catégorie donnée (type) dans la table (budget)

	//Budget dépensé ou prévu (l'un des deux) doit être différent de 0
	if (budgetForType.budgetSpent !== 0 || budgetForType.budgetPlanned !== 0) {
		budgetsForType.push({
			budgetPlanned: budgetForType.budgetPlanned / nbDay,
			budgetSpent: budgetForType.budgetSpent / nbDay
		});
	}
};

export const getStatisticsProperties = budgets => {
	if (budgets.length !== 0) {
		let avgBudgetSpent = 0;
		let avgBudgetPlanned = 0;
		let minBudgetSpent = budgets[0].budgetSpent;
		let maxBudgetSpent = 0;
		let stdDeviation = 0;
		let stdErrorWithForecast = null;
		//Défini seulement si avgBudgetPlanned !=0
		let numberOfForecast = 0;

		for (var i = 0; i < budgets.length; i++) {
			const budgetSpent = budgets[i].budgetSpent;
			const budgetPlanned = budgets[i].budgetPlanned;

			//Moyenne budget dépensé
			avgBudgetSpent += budgetSpent;
			//Moyenne budget plannifié
			avgBudgetPlanned += budgetPlanned;
			//Budget minimal
			if (budgetSpent < minBudgetSpent) {
				minBudgetSpent = budgetSpent;
			}
			//Budget maximal
			if (budgetSpent > maxBudgetSpent) {
				maxBudgetSpent = budgetSpent;
			}
			numberOfForecast++;
		}
		avgBudgetSpent /= numberOfForecast;
		avgBudgetPlanned /= numberOfForecast;
		stdErrorWithForecast = avgBudgetPlanned === 0 ? (avgBudgetSpent - avgBudgetPlanned) * 100 / avgBudgetPlanned : null;

		for (var i = 0; i < budgets.length; i++) {
			const budgetSpent = budgets[i].budgetSpent;
			stdDeviation += Math.pow(budgetSpent - avgBudgetSpent, 2);
		}
		stdDeviation /= numberOfForecast;

		avgBudgetSpent = roundTo2Decimals(avgBudgetSpent);
		avgBudgetPlanned = roundTo2Decimals(avgBudgetPlanned);
		minBudgetSpent = roundTo2Decimals(minBudgetSpent);
		maxBudgetSpent = roundTo2Decimals(maxBudgetSpent);
		stdDeviation = roundTo2Decimals(stdDeviation);
		stdErrorWithForecast = stdErrorWithForecast ? roundTo2Decimals(stdErrorWithForecast) : null;

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
