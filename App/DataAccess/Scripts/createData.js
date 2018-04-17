import { clearDatabase } from "./UpdateDatabase";
import { updateCurrenciesFromApi } from "../ObjectsRepositories/CurrencyRepository";
import { getObjectsFiltered, getObjects } from "./Requests";
import { createCountryFromRestCountries } from "../ObjectsRepositories/CountryRepository";
import { addTown, updateTown } from "../ObjectsRepositories/TownRepository";
import { addUser } from "../ObjectsRepositories/UserRepository";
import { addLegOfTrip, addTrip } from "../ObjectsRepositories/TripRepository";
import { addExpenditure } from "../ObjectsRepositories/BudgetRepository";

//Fichier test pour vérifier la structure et le fonctionnement de la BDD
export const createData = async () => {
	clearDatabase();

	await updateCurrenciesFromApi(); //Création des monnaies
	createCountryFromRestCountries();

	const euro = getObjectsFiltered("Currency", "code='EUR'")[0];
	const dollar = getObjectsFiltered("Currency", "code='USD'")[0];

	const france = getObjectsFiltered("Country", "name='France'")[0];
	const usa = getObjectsFiltered("Country", "name='États-Unis'")[0];

	const paris = addTown("Paris", france);
	const bordeaux = addTown("Bordeaux", france);

	const washington = addTown("Washington", usa);
	const newyork = addTown("New York", usa);

	const user = addUser("vicID", "vicPWD", "Domecq", "Victor", euro);

	washingtonTrip = addLegOfTrip(new Date(2018, 8, 15), new Date(2018, 8, 18), washington, "lowBudget");
	newyorkTrip = addLegOfTrip(new Date(2018, 8, 18), new Date(2018, 8, 21), newyork, "mediumBudget");

	addTrip(user, "États-unis", [washingtonTrip, newyorkTrip]);

	addExpenditure(washingtonTrip.budget, "Transport", 5);
	addExpenditure(washingtonTrip.budget, "Food", 3, new Date(), "Hamburger");
	addExpenditure(washingtonTrip.budget, "Shopping", 3, new Date(), "T-shirt");
	addExpenditure(washingtonTrip.budget, "Food", 2.5, new Date(), "Bière");

	updateTown(washington);
	// console.log(washington.budgetForecast[0]);
};
