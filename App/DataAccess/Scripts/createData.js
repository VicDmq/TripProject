import { clearDatabase } from "./UpdateDatabase";
import { createCurrenciesFromApi, updateCurrenciesValues } from "../ObjectsRepositories/CurrencyRepository";
import { getObjectsFiltered, getObjects } from "./Requests";
import { createCountryFromRestCountries } from "../ObjectsRepositories/CountryRepository";
import { updateTown, getTownByNameAndCountryName } from "../ObjectsRepositories/TownRepository";
import { addUser } from "../ObjectsRepositories/UserRepository";
import { addLegOfTrip, addTrip } from "../ObjectsRepositories/TripRepository";
import { addExpenditure, updateBudgetPlanned, updateTotalBudgetPlanned } from "../ObjectsRepositories/BudgetRepository";

//Fichier test pour vérifier la structure et le fonctionnement de la BDD
export const createData = async () => {
	clearDatabase();

	await createCurrenciesFromApi(); //Création des monnaies (celles qui n'existent pas encore sur la BDD)
	await updateCurrenciesValues(); //Mise à jour des taux de changes
	if (getObjects("Country").length === 0) createCountryFromRestCountries();

	const euro = getObjectsFiltered("Currency", "code='EUR'")[0];

	const usa = getObjectsFiltered("Country", "name='États-Unis'")[0];
	const canada = getObjectsFiltered("Country", "name='Canada'")[0];

	const washington = getTownByNameAndCountryName("Washington", usa.name);
	const newyork = getTownByNameAndCountryName("New-york", usa.name);
	const toronto = getTownByNameAndCountryName("Toronto", canada.name);

	const user = addUser("A", "A", "", "", euro);

	washingtonTrip = addLegOfTrip(new Date(2018, 1, 15), new Date(2018, 1, 17), washington, "mediumBudget");
	newyorkTrip = addLegOfTrip(new Date(2018, 1, 18), new Date(2018, 1, 19), newyork, "mediumBudget");
	torontoTrip = addLegOfTrip(new Date(2018, 1, 19), new Date(2018, 1, 26), toronto, "mediumBudget");

	addTrip(user, "États-unis/Canada", [washingtonTrip, newyorkTrip, torontoTrip]);

	//Budget de washington
	updateBudgetPlanned(washingtonTrip.budget, "Transport", 35);
	updateBudgetPlanned(washingtonTrip.budget, "Food", 100);
	updateBudgetPlanned(washingtonTrip.budget, "Shopping", 20);
	updateBudgetPlanned(washingtonTrip.budget, "Housing", 250);
	updateBudgetPlanned(washingtonTrip.budget, "LeisureActivities", 70);
	updateBudgetPlanned(washingtonTrip.budget, "Sightseeing", 50);
	updateTotalBudgetPlanned(washingtonTrip.budget);

	addExpenditure(washingtonTrip.budget, "Transport", 40);
	addExpenditure(washingtonTrip.budget, "Food", 150);
	addExpenditure(washingtonTrip.budget, "Shopping", 5);
	addExpenditure(washingtonTrip.budget, "Housing", 250);
	addExpenditure(washingtonTrip.budget, "LeisureActivities", 85);
	addExpenditure(washingtonTrip.budget, "Sightseeing", 46);

	//Budget de New-york
	updateBudgetPlanned(newyorkTrip.budget, "Transport", 5);
	updateBudgetPlanned(newyorkTrip.budget, "Food", 20);
	updateBudgetPlanned(newyorkTrip.budget, "Shopping", 0);
	updateBudgetPlanned(newyorkTrip.budget, "Housing", 90);
	updateBudgetPlanned(newyorkTrip.budget, "LeisureActivities", 30);
	updateBudgetPlanned(newyorkTrip.budget, "Sightseeing", 0);
	updateTotalBudgetPlanned(newyorkTrip.budget);

	addExpenditure(newyorkTrip.budget, "Transport", 5);
	addExpenditure(newyorkTrip.budget, "Food", 30);
	addExpenditure(newyorkTrip.budget, "Shopping", 5);
	addExpenditure(newyorkTrip.budget, "Housing", 90);
	addExpenditure(newyorkTrip.budget, "LeisureActivities", 27);
	addExpenditure(newyorkTrip.budget, "Sightseeing", 46);

	//Budget de Toronto
	updateBudgetPlanned(torontoTrip.budget, "Transport", 60);
	updateBudgetPlanned(torontoTrip.budget, "Food", 190);
	updateBudgetPlanned(torontoTrip.budget, "Shopping", 10);
	updateBudgetPlanned(torontoTrip.budget, "Housing", 460);
	updateBudgetPlanned(torontoTrip.budget, "LeisureActivities", 75);
	updateBudgetPlanned(torontoTrip.budget, "Sightseeing", 150);
	updateTotalBudgetPlanned(torontoTrip.budget);

	addExpenditure(torontoTrip.budget, "Transport", 40);
	addExpenditure(torontoTrip.budget, "Food", 154.23);
	addExpenditure(torontoTrip.budget, "Shopping", 5);
	addExpenditure(torontoTrip.budget, "Housing", 460);
	addExpenditure(torontoTrip.budget, "LeisureActivities", 85);
	addExpenditure(torontoTrip.budget, "Sightseeing", 46);

	//Mise à jour des estimations
	updateTown(washington);
	updateTown(newyork);
	updateTown(toronto);
};
