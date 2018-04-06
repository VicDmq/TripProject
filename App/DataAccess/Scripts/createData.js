import { clearDatabase } from "./UpdateDatabase";
import { updateCurrenciesFromApi } from "../ObjectsRepositories/CurrencyRepository";
import { getObjectsFiltered, getObjects } from "./Requests";
import { addCountry } from "../ObjectsRepositories/CountryRepository";
import { addTown, updateTown } from "../ObjectsRepositories/TownRepository";
import { addUser } from "../ObjectsRepositories/UserRepository";
import { addLegOfTrip, addTrip } from "../ObjectsRepositories/TripRepository";
import { addExpenditure } from "../ObjectsRepositories/BudgetRepository";

//Fichier test pour vérifier la structure et le fonctionnement de la BDD
export const createData = async () => {
	clearDatabase();

	await updateCurrenciesFromApi(); //Création des monnaies

	const euro = getObjectsFiltered("Currency", "symbol='EUR'")[0];
	const dollar = getObjectsFiltered("Currency", "symbol='USD'")[0];

	const france = addCountry("France", euro);
	const usa = addCountry("USA", dollar);

	const washington = addTown("Washington", usa);
	const newyork = addTown("New York", usa);

	const user = addUser("vicID", "vicPWD", "Domecq", "Victor", france);

	washingtonTrip = addLegOfTrip(new Date(2018, 1, 15), new Date(2018, 1, 18), washington, "lowBudget");
	newyorkTrip = addLegOfTrip(new Date(2018, 1, 18), new Date(2018, 1, 21), newyork, "mediumBudget");

	addTrip(user, [washingtonTrip, newyorkTrip]);

	addExpenditure(washingtonTrip.budget, "Transport", 5);
	addExpenditure(washingtonTrip.budget, "Food", 3, new Date(), "Hamburger");
	addExpenditure(washingtonTrip.budget, "Shopping", 3, new Date(), "T-shirt");
	addExpenditure(washingtonTrip.budget, "Food", 2.5, new Date(), "Bière");

	updateTown(washington);
	console.log(washington.budgetForecast[0]);
};
