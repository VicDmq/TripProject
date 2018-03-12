const Realm = require("realm");
import { realm } from "../Database/Realm";

//Permet de créer un objet ayant un type et des propriétés
export const createObject = (typeOfObject, properties) => {
	let newObject = undefined;
	realm.write(() => {
		newObject = realm.create(typeOfObject, properties);
	});
	return newObject;
};

//Permet de modifier la propriété d'un objet
export const updateObjectProperty = (object, property, newProperty) => {
	if (object[property] !== newProperty)
		realm.write(() => {
			object[property] = newProperty;
		});
};

//Permet de rajouter un objet à une propriété de type liste d'un objet
//Cet objet peut également être un string, char, double, ...
export const addObjecToPropertyList = (object, property, objectToBeAdded) => {
	realm.write(() => {
		object[property].push(objectToBeAdded);
		//object[property] est équivalent à object.property
	});
};

//Supprime un objet
export const deleteObject = object => {
	realm.write(() => {
		realm.delete(object);
	});
};

//Supprime tous les objets de type "typeOfObject"
export const deleteObjects = typeOfObject => {
	const objects = realm.objects(typeOfObject);
	realm.write(() => {
		realm.delete(objects);
	});
};

//Supprime la base de données
export const deleteAll = () => {
	realm.write(() => {
		realm.deleteAll();
	});
};
