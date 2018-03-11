export const convertToUserCurrency = (priceToConvert, valueOfLocalCurrency) => {
	const priceConverted = roundTo2Decimals(priceToConvert / valueOfOtherCurrency);
	return priceConverted;
};

export const roundTo2Decimals = valueToRound => {
	const value = Math.round(valueToRound * 100) / 100;
	return value;
};
