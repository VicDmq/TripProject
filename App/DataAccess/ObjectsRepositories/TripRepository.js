import { createObject, addObjectToPropertyList, updateObjectProperty, deleteObject } from "../Scripts/UpdateDatabase";
import { addBudget } from "./BudgetRepository";
import { getDateToString, convertToUserCurrency } from "../../Functions";

//Création d'un voyage d'un utilisateur avec potentiellement plusieurs étapes
export const addTrip = (user, title, legsOfTrip) => {
	const dates = getDatesOfTrip(legsOfTrip);

	const properties = {
		title: title,
		dateOfArrival: dates.dateOfArrival,
		dateOfDeparture: dates.dateOfDeparture,
		legsOfTrip: legsOfTrip
	};
	const newTrip = createObject("Trip", properties);
	addObjectToPropertyList(user, "trips", newTrip);

	return newTrip;
};

//Création d'une étape d'un voyage
export const addLegOfTrip = (dateOfArrival, dateOfDeparture, town, typeOfBudget) => {
	const properties = {
		dateOfArrival: dateOfArrival,
		dateOfDeparture: dateOfDeparture,
		town: town
	};
	const newLegOfTrip = createObject("LegOfTrip", properties);

	updateObjectProperty(newLegOfTrip, "budget", addBudget(typeOfBudget));

	return newLegOfTrip;
};

//Modification d'une étape d'un voyage
export const updateLegOfTrip = (trip, legOfTrip, dateOfArrival, dateOfDeparture, town) => {
	updateObjectProperty(legOfTrip, "dateOfArrival", dateOfArrival);
	updateObjectProperty(legOfTrip, "dateOfDeparture", dateOfDeparture);
	updateObjectProperty(legOfTrip, "town", town);

	//Mise à jour des dates
	updateTrip(trip);
};

//Suppression d'une étape du voyage
export const deleteLegOfTrip = (trip, legOfTrip) => {
	deleteObject(legOfTrip);
	if (trip.legsOfTrip.length === 0) {
		deleteObject(trip);
	} else {
		updateTrip();
	}
};

//Modification du voyage : dates ou ajout d'une ou plusieurs étapes
export const updateTrip = (trip, newTitle, newLegsOfTrip = []) => {
	if (newLegsOfTrip.length !== 0) {
		for (var i = 0; i < newLegsOfTrip.length; i++) {
			addObjectToPropertyList(trip, "legsOfTrip", newLegsOfTrip[i]);
		}
	}
	updateTrip(trip, "title", newTitle);
	const dates = getDatesOfTrip(trip.legsOfTrip);
	updateObjectProperty(trip, "dateOfArrival", dates.dateOfArrival);
	updateObjectProperty(trip, "dateOfDeparture", dates.dateOfArrival);
};

//Permet de calculer les dates de début et de fin d'un voyage en fonction des étapes
const getDatesOfTrip = legsOfTrip => {
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
	}
	//Return un JSON contenant les deux propriétés qui nous intéressent
	const dates = {
		dateOfArrival: dateOfArrival,
		dateOfDeparture: dateOfDeparture
	};

	return dates;
};

//Utilisé par l'écran d'accueil ou l'on affiche le prochain voyage ou alors le voyage en cours
export const findNextOrCurrentTrip = user => {
	const trips = user.trips;
	let i = 0;
	let returnThisTrip = false;
	const dateOfToday = new Date();
	let nextOrCurrentTrip = undefined;
	let comingOrNow;

	while (!returnThisTrip && i < trips.length) {
		const trip = trips[i];

		if (trip.dateOfArrival - dateOfToday < 0 && trip.dateOfArrival - dateOfToday > 0) {
			returnThisTrip = true;
			nextOrCurrentTrip = trip;
			comingOrNow = "now";
		} else if (nextOrCurrentTrip === undefined || trip.dateOfArrival - nextOrCurrentTrip.dateOfArrival < 0) {
			nextOrCurrentTrip = trip;
			comingOrNow = "coming";
		}

		i++;
	}

	if (nextOrCurrentTrip !== undefined) {
		return {
			information: setTripInformationInJSON(nextOrCurrentTrip, user.currency),
			period: comingOrNow
		};
	} else {
		return undefined;
	}
};

//Permet de passer les informations d'un voyage au sein d'un fichier JSON
const setTripInformationInJSON = (trip, userCurrency) => {
	let legsOfTripTownToString = "";
	const totalBudget = {
		totalBudgetSpent: 0,
		totalBudgetPlanned: 0
	};

	trip.legsOfTrip.forEach(legOfTrip => {
		legsOfTripTownToString += legOfTrip.town.name + " - ";
		//On convertit dans la monnaie de l'utilisateur puis on l'ajoute au total
		totalBudget.totalBudgetSpent += convertToUserCurrency(
			legOfTrip.budget.totalBudgetSpent,
			userCurrency,
			legOfTrip.town.country.currency
		);
		//On convertit dans la monnaie de l'utilisateur puis on l'ajoute au total
		totalBudget.totalBudgetPlanned += convertToUserCurrency(
			legOfTrip.budget.totalBudgetPlanned,
			userCurrency,
			legOfTrip.town.country.currency
		);
	});

	return {
		title: trip.title,
		legsOfTrip: legsOfTripTownToString.substring(0, legsOfTripTownToString.length - 3),
		dateOfArrival: getDateToString(trip.dateOfArrival),
		dateOfDeparture: getDateToString(trip.dateOfDeparture),
		totalBudget: totalBudget,
		currencySymbol: userCurrency.symbol
	};
};
