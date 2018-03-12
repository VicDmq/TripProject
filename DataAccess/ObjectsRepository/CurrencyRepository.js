import { createObject, updateObjectProperty } from "../Scripts/UpdateDatabase";
import { getRatesFromEuro, getSymbols } from "../../Api/Fixer";
import { getObjects } from "../Scripts/Requests";

//Création d'une monnaie avec rates = valeur optionnel
//Cela permet de ne faire qu'une seule fois la requête à l'api
//Contenu asynchronisé = async
export const addCurrency = async (name, symbol, rates) => {
	const properties = {
		name: name,
		symbol: symbol
	};

	const newCurrency = createObject("Currency", properties);

	if (symbol !== "EUR") {
		if (!rates) {
			//Si rates non défini, on fait la demande à l'api et on attend la réponse
			rates = await getRatesFromEuro();
		}
		await updateCurrencyValue(newCurrency, rates);
	}

	return newCurrency;
};

//Met à jour la valeur valueAgainstOneEuro
export const updateCurrencyValue = async (currency, rates) => {
	rates = await rates;
	if (rates.values[currency.symbol]) {
		//On évite de mettre undefined à valueAgainstOneEuro
		if (rates.status === "updated" || (rates.status === "default" && currency.valueAgainstOneEuro === 1)) {
			//Si ça a déjà été définis et que rates contient les valeurs par defauts on converse cette valeur
			updateObjectProperty(currency, "valueAgainstOneEuro", rates.values[currency.symbol]);
		}
	}
};

//Met à jour toutes les monnaies
export const updateCurrenciesValues = async () => {
	const rates = await getRatesFromEuro();
	currencies = getObjects("Currency");

	for (var i = 0; i < currencies.length; i++) {
		updateCurrencyValue(currencies[i], rates);
	}
};

//Création de toutes les monnaies disponibles sur l'API
//Remarque : les noms sont en anglais
export const addCurrenciesFromApi = async () => {
	let symbols = await getSymbols();
	//Formatage du JSON
	symbols = eval(symbols);

	const rates = await getRatesFromEuro();

	deleteObjects("Currency");
	//On supprime tout pour éviter les duplicatas

	for (var symbol in symbols) {
		addCurrency(symbols[symbol], symbol, rates);
	}
};
