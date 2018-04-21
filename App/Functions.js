//Convertit le prix dans la monnaie de l'utilisateur
export const convertToOtherCurrency = (priceToConvert, startCurrency, finalCurrency) => {
	if (startCurrency === finalCurrency) {
		return priceToConvert;
	} else {
		const priceInEuro = convertToEuro(priceToConvert, finalCurrency);
		if (startCurrency.name === "Euro") {
			return roundTo2Decimals(priceInEuro);
		} else {
			return roundTo2Decimals(priceInEuro * startCurrency.valueAgainstOneEuro);
		}
	}
};

//Convertit le prix en euro
export const convertToEuro = (priceToConvert, currency) => {
	return priceToConvert / currency.valueAgainstOneEuro;
};

//Arrondit à la deuxième décimale
export const roundTo2Decimals = valueToRound => {
	const value = Math.round(valueToRound * 100) / 100;
	return value;
};

//Calcule le nombre de jours d'une période délimitée par deux dates
export const getNbDaysBetween2Dates = (date1, date2) => {
	//86 400 000 = 1000*60*60*24 (nombre de millisecondes dans une journée)
	//date1 - date2 donne la différence en millisecondes
	//On rajoute +1, car toutes les dates ont pour heure 00h, donc la dernière journée n'est pas prise en
	//compte si on ne rajoute pas +1
	return Math.abs(Math.floor((date1 - date2) / 86400000)) + 1;
};

//Retourne une date à un certain format
export const getDateToString = date => {
	days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
	months = [
		"Janvier",
		"Février",
		"Mars",
		"Avril",
		"Mai",
		"Juin",
		"Juillet",
		"Août",
		"Septembre",
		"Novembre",
		"Décembre"
	];

	return days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
};

//Permet de vérifier si deux périodes sont l'une sur l'autre : utilisé pour l'ajout d'un voyage
export const isPeriodInsideOtherPeriod = (dateBegin1, dateEnd1, dateBegin2, dateEnd2) => {
	if (
		(dateBegin1 - dateBegin2 <= 0 && dateEnd1 - dateBegin2 >= 0) ||
		(dateBegin1 - dateEnd2 <= 0 && dateEnd1 - dateEnd2 >= 0) ||
		(dateBegin1 - dateBegin2 >= 0 && dateEnd1 - dateEnd2 <= 0) ||
		(dateBegin1 - dateBegin2 <= 0 && dateEnd1 - dateEnd2 >= 0)
	) {
		return true;
	} else {
		return false;
	}
};
