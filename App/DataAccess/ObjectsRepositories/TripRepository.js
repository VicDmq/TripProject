import { createObject, addObjectToPropertyList, updateObjectProperty, deleteObject } from "../Scripts/UpdateDatabase";
import { addBudget } from "./BudgetRepository";

//Création d'un voyage d'un utilisateur avec potentiellement plusieurs étapes
export const addTrip = (user, legsOfTrip) => {
	const dates = getDatesOfTrip();

	const properties = {
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
export const updateTrip = (trip, newLegsOfTrip = []) => {
	if (newLegsOfTrip.length !== 0) {
		for (var i = 0; i < newLegsOfTrip.length; i++) {
			addObjectToPropertyList(trip, "legsOfTrip", newLegsOfTrip[i]);
		}
	}
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
