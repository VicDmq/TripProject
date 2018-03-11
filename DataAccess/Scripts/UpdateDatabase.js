const Realm = require("realm");
import { realm } from "../Database/Realm";

export const createObject = (typeOfObject, properties) => {
	let newObject = undefined;
	realm.write(() => {
		newObject = realm.create(typeOfObject, properties);
	});
	return newObject;
};

export const updateObjectProperty = (object, property, newProperty) => {
	if (object[property] !== newProperty)
		realm.write(() => {
			object[property] = newProperty;
		});
};

export const addObjecToPropertyList = (object, property, objectToBeAdded) => {
	realm.write(() => {
		object[property].push(objectToBeAdded);
	});
};
