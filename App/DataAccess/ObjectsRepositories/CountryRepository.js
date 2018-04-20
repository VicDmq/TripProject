import { createObject } from "../Scripts/UpdateDatabase";
import { getObjectsFiltered } from "../Scripts/Requests";

import { RestCountriesDefault } from "../../Api/RestCountries/RestCountries";

import { updateCurrencySymbol } from "./CurrencyRepository";

export const addCountry = (name, currency) => {
	const properties = {
		name: name,
		currency: currency
	};
	return createObject("Country", properties);
};

export const createCountryFromRestCountries = () => {
	RestCountriesDefault.forEach(countryInformations => {
		//Certains pays ont plus d'une monnaie : rare donc j'ai décidé de ne pas les prendre en compte
		if (countryInformations.currencies.length === 1) {
			//On récupère la monnaie correspondante à ce pays
			const request = "code='" + countryInformations.currencies[0].code + "'";
			const currency = getObjectsFiltered("Currency", request)[0];
			//Si elle existe déjà dans la base de données
			if (currency !== undefined) {
				const countryName = countryInformations.translations.fr;
				//Certains pays n'ont pas de traductions en français
				if (countryName !== undefined) {
					const currencySymbol = countryInformations.currencies[0].symbol;
					//Parfois un symbole est disponible, sinon le symbole sera le code de base
					if (currencySymbol !== undefined) {
						updateCurrencySymbol(currency, countryInformations.currencies[0].symbol);
					}
					//On ajoute le pays
					addCountry(countryName, currency);
				}
			}
		}
	});
};
