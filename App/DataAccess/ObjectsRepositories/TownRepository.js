import { createObject, addObjectToPropertyList, updateObjectProperty } from "../Scripts/UpdateDatabase";
import { updateBudgetForecast } from "./BudgetForecastRepository";
import { getObjectsFiltered } from "../Scripts/Requests";

export const addTown = (name, country) => {
	const properties = {
		name: name,
		country: country
	};

	const newTown = createObject("Town", properties);

	//Initialisation des tables statistiques pour la table BudgetForecast
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

	addObjectToPropertyList(newTown, "budgetForecast", lowBudgetForecast);
	addObjectToPropertyList(newTown, "budgetForecast", mediumBudgetForecast);
	addObjectToPropertyList(newTown, "budgetForecast", highBudgetForecast);

	return newTown;
};

export const updateTown = town => {
	updateBudgetForecast(town, "lowBudget");
	updateBudgetForecast(town, "mediumBudget");
	updateBudgetForecast(town, "highBudget");
};

export const getTownByNameAndCountryName = (townName, countryName) => {
	const request = "name='" + townName + "' AND country.name='" + countryName + "'";
	const towns = getObjectsFiltered("Town", request);

	if (towns.length === 0) {
		const request = "name='" + countryName + "'";
		const country = getObjectsFiltered("Country", request)[0];
		return addTown(townName, country);
	} else {
		return towns[0];
	}
};
