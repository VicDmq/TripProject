import { createObject, updateObjectProperty } from "../Scripts/UpdateDatabase";
import { getRatesFromEuro, getCodes } from "../../Api/Fixer/Fixer";
import { getObjects, getObjectsFiltered } from "../Scripts/Requests";

//Création d'une monnaie avec rates = valeur optionnel
//Cela permet de ne faire qu'une seule fois la requête à l'api
//Contenu asynchronisé = async
export const addCurrency = async (name, code, rates) => {
	const properties = {
		name: name,
		code: code,
		symbol: code
	};

	const newCurrency = createObject("Currency", properties);

	if (code !== "EUR") {
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
	if (rates.values[currency.code]) {
		//On évite de mettre undefined à valueAgainstOneEuro
		if (rates.status === "updated" || (rates.status === "default" && currency.valueAgainstOneEuro === 1)) {
			//Si ça a déjà été définis et que rates contient les valeurs par defauts on converse cette valeur
			updateObjectProperty(currency, "valueAgainstOneEuro", rates.values[currency.code]);
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
export const updateCurrenciesFromApi = async () => {
	let codes = await getCodes();
	//Formatage du JSON
	codes = eval(codes);

	const rates = await getRatesFromEuro();

	for (var code in codes) {
		const request = "name='" + codes[code] + "' AND code='" + code + "'";
		const currency = getObjectsFiltered("Currency", request);
		if (currency.length === 0) {
			addCurrency(codes[code], code, rates);
		}
	}
};

//Utilisé dans CountryRepository : pour changer le symbole de la monnaie si possible
export const updateCurrencySymbol = (currency, newSymbol) => {
	updateObjectProperty(currency, "symbol", newSymbol);
};

export const getCurrencyByCode = code => {
	const request = "code='" + code + "'";
	return getObjectsFiltered("Currency", request)[0];
};
