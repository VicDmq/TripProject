export const convertToUserCurrency = (priceToConvert, userCurrency, otherCurrency) => {
	const priceInEuro = convertToEuro(priceToConvert, otherCurrency);
	if (UserCurrency.name === "Euro") {
		return roundTo2Decimals(priceInEuro);
	} else {
		return roundTo2Decimals(priceInEuro * userCurrency.valueAgainstOneEuro);
	}
};

export const convertToEuro = (priceToConvert, currency) => {
	return priceToConvert / currency.valueAgainstOneEuro;
};

export const roundTo2Decimals = valueToRound => {
	const value = Math.round(valueToRound * 100) / 100;
	return value;
};
