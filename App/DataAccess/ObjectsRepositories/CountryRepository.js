import { createObject } from "../Scripts/UpdateDatabase";

export const addCountry = (name, currency) => {
	const properties = {
		name: name,
		currency: currency
	};
	return createObject("Country", properties);
};
