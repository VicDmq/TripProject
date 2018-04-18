//Convertit le prix dans la monnaie de l'utilisateur
export const convertToUserCurrency = (priceToConvert, userCurrency, otherCurrency) => {
	if (userCurrency === otherCurrency) {
		return priceToConvert;
	} else {
		const priceInEuro = convertToEuro(priceToConvert, otherCurrency);
		if (userCurrency.name === "Euro") {
			return roundTo2Decimals(priceInEuro);
		} else {
			return roundTo2Decimals(priceInEuro * userCurrency.valueAgainstOneEuro);
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
