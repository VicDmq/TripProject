import { createObject, updateObjectProperty } from "../Scripts/UpdateDatabase";
import { getRatesFromEuro } from "../../Api/Fixer";
import { getObjects } from "../Scripts/Requests";

export const addCurrency = async (name, symbol) => {
	const properties = {
		name: name,
		symbol: symbol
	};

	const newCurrency = createObject("Currency", properties);
	await updateCurrencyValue(newCurrency);
	return newCurrency;
};

export const updateCurrencyValue = async currency => {
	const rates = await getRatesFromEuro();
	if (rates[currency.symbol] && rates !== {}) {
		updateObjectProperty(currency, "valueAgainstOneEuro", rates[currency.symbol]);
	} else {
		//TODO
	}
};

export const uddateCurrenciesValues = async () => {
	const rates = await getRatesFromEuro();
	if (rates !== {}) {
		currencies = getObjects("Currency");
		for (var i = 0; i < currencies.length; i++) {
			if (rates[currencies[i].symbol]) {
				updateObjectProperty(currencies[i], "valueAgainstOneEuro", rates[currencies[i].symbol]);
			}
		}
	} else {
		//TODO
	}
};
