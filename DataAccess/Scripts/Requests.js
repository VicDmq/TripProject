const Realm = require("realm");
import { realm } from "../Database/Realm";

//Retourne tout les objets ayant le type souhaité
export const getObjects = typeOfObject => {
	return realm.objects(typeOfObject);
};

//Retourne tout les objets ayant le type souhaité et répondant aux conditions de la requête
export const getObjectsFiltered = (typeOfObject, request) => {
	return realm.objects(typeOfObject).filtered(request);
};
