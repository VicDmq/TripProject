import { updateObjectProperty } from "../Scripts/UpdateDatabase";
import { getObjectsFiltered } from "../Scripts/Requests";

import { roundTo2Decimals, getNbDaysBetween2Dates, convertToOtherCurrency } from "../../Functions";

import { getTownByNameAndCountryName } from "./TownRepository";

export const updateBudgetForecast = (town, typeOfBudget) => {
	const request = "town.name ='" + town.name + "' AND budget.typeOfBudget='" + typeOfBudget + "'";
	const legsOfTrip = getObjectsFiltered("LegOfTrip", request);
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
		const nbDay = getNbDaysBetween2Dates(legsOfTrip[i].dateOfArrival, legsOfTrip[i].dateOfDeparture);
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

	const budgetForecast = town.budgetForecast.filter(budgetForecast => budgetForecast.type === typeOfBudget)[0];

	//Mise à jour des nouvelles données dans la table budgetForecast
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

const getStatisticsProperties = budgets => {
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
		//Défini seulement si la moyenne des budgets plannifiés est différente de 0 (pour éviter division par 0)
		stdErrorWithForecast = avgBudgetPlanned !== 0 ? (avgBudgetSpent - avgBudgetPlanned) * 100 / avgBudgetPlanned : null;

		//Calcul de l'écart type
		for (var i = 0; i < budgets.length; i++) {
			const budgetSpent = budgets[i].budgetSpent;
			stdDeviation += Math.pow(budgetSpent - avgBudgetSpent, 2);
		}
		stdDeviation /= numberOfForecast;

		//Arrondi à la deuxième décimal
		avgBudgetSpent = roundTo2Decimals(avgBudgetSpent);
		avgBudgetPlanned = roundTo2Decimals(avgBudgetPlanned);
		minBudgetSpent = roundTo2Decimals(minBudgetSpent);
		maxBudgetSpent = roundTo2Decimals(maxBudgetSpent);
		stdDeviation = roundTo2Decimals(stdDeviation);
		stdErrorWithForecast = stdErrorWithForecast ? roundTo2Decimals(stdErrorWithForecast) : null;

		//Envoi d'un JSON correspondant aux propriétés de la table StatisticsForBudget
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
		//Envois un JSON vide si aucune données
		return {};
	}
};

//Cette fonction permet de récupérer les estimations calculées d'une ville suivant une catégorie
//de dépenses et d'un type de budget
export const getBudgetForecastByCategory = (townName, countryName, category, typeOfBudget, userCurrency) => {
	//On récupère l'objet correspondant à la ville
	const town = getTownByNameAndCountryName(townName, countryName);

	//On récupère l'estimation correspondant au type de budget
	const budgetForecast = town.budgetForecast.find(budgetForecast => {
		if (budgetForecast.type === typeOfBudget) return true;
	});

	//On récupère l'estimation correspondant à la catégorie de dépenses
	const statistics = budgetForecast["statisticsFor" + category];

	return {
		statisticsAreDefined: statistics.statisticsAreDefined,
		avgBudgetSpent:
			convertToOtherCurrency(statistics.avgBudgetSpent, town.country.currency, userCurrency) +
			" " +
			userCurrency.symbol,
		avgBudgetPlanned:
			convertToOtherCurrency(statistics.avgBudgetPlanned, town.country.currency, userCurrency) +
			" " +
			userCurrency.symbol,
		minBudgetSpent:
			convertToOtherCurrency(statistics.minBudgetSpent, town.country.currency, userCurrency) +
			" " +
			userCurrency.symbol,
		maxBudgetSpent:
			convertToOtherCurrency(statistics.maxBudgetSpent, town.country.currency, userCurrency) +
			" " +
			userCurrency.symbol,
		stdDeviation: statistics.stdDeviation,
		stdErrorWithForecast: statistics.stdErrorWithForecast ? statistics.stdErrorWithForecast : 0,
		numberOfForecast: statistics.numberOfForecast
	};
};
