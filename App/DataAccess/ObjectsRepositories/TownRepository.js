import { createObject, addObjectToPropertyList } from "../Scripts/UpdateDatabase";
import { getObjectsFiltered } from "../Scripts/Requests";

import { updateBudgetForecast } from "./BudgetForecastRepository";

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

	//On ajoute ces tables à la ville qui vient d'être créée
	addObjectToPropertyList(newTown, "budgetForecast", lowBudgetForecast);
	addObjectToPropertyList(newTown, "budgetForecast", mediumBudgetForecast);
	addObjectToPropertyList(newTown, "budgetForecast", highBudgetForecast);

	return newTown;
};

//Permet de mettre à jour les estimations de la ville pour tout les types de budget
export const updateTown = town => {
	updateBudgetForecast(town, "lowBudget");
	updateBudgetForecast(town, "mediumBudget");
	updateBudgetForecast(town, "highBudget");
};

//Permet de récupérer une ville ayant le même nom de ville et de pays que les paramètres
export const getTownByNameAndCountryName = (townName, countryName) => {
	const request = "name='" + townName + "' AND country.name='" + countryName + "'";
	const towns = getObjectsFiltered("Town", request);

	//Si la ville n'existe pas encore, on en ajoute une
	if (towns.length === 0) {
		const request = "name='" + countryName + "'";
		const country = getObjectsFiltered("Country", request)[0];
		return addTown(townName, country);
	} else {
		//Sinon on retourne celle déjà existante
		return towns[0];
	}
};
