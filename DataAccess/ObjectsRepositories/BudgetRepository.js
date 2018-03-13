import { createObject, addObjectToPropertyList, updateObjectProperty } from "../Scripts/UpdateDatabase";

//Création d'un budget associé à une étape d'un voyage
//typeOfBudget désigne la catégorie du voyageur : petit budget, moyen ou gros
export const addBudget = typeOfBudget => {
	const budgetProperties = {
		typeOfBudget: typeOfBudget
	};
	const newBudget = createObject("Budget", budgetProperties);

	//Type de catégories pour les budgets spécifiques à ajouter à la propriété "budgetsByCategory" de Budget
	categories = ["Transport", "Housing", "Food", "Sightseeing", "Shopping", "LeisureActivities"];
	for (var i = 0; i < categories.length; i++) {
		const budgetsByCategoryProperties = {
			category: categories[i]
		};
		const newBudgetByCategory = createObject("BudgetByCategory", budgetsByCategoryProperties);
		addObjectToPropertyList(newBudget, "budgetsByCategory", newBudgetByCategory);
	}
	return newBudget;
};

//Ajout d'une dépense associée à un budget
//Type désigne la catégorie à laquelle la dépense est associée
export const addExpenditure = (budget, category, price = 0, date = new Date(), justification) => {
	const properties = {
		price: price,
		date: date,
		justification: justification
	};

	//Enregistrement de la dépense dans la BDD
	const newExpenditure = createObject("Expenditure", properties);

	//On récupère un budget(budgetForType) pour une catégorie donnée (category) dans la table (budget)
	const budgetByCategory = budget.budgetsByCategory.filter(
		budgetByCategory => budgetByCategory.category === category
	)[0];

	addObjectToPropertyList(budgetByCategory, "expenditures", newExpenditure);

	//Mise à jour du budget dépensé dans cette catégorie
	budgetSpent = budgetByCategory.budgetSpent + price;
	updateObjectProperty(budgetByCategory, "budgetSpent", budgetSpent);

	//Mise à jour du budget total dépensé
	totalBudgetSpent = budget.totalBudgetSpent + price;
	updateObjectProperty(budget, "totalBudgetSpent", totalBudgetSpent);
};

export const updateBudgetPlanned = (budget, category, budgetPlanned) => {
	const budgetByCategory = budget.budgetsByCategory.filter(
		budgetByCategory => budgetByCategory.category === category
	)[0];

	updateObjectProperty(budgetByCategory, "budgetPlanned", budgetPlanned);
	updateObjectProperty(budget, "budgetPlanned", budget.budgetPlanned + budgetPlanned);
};

export const updateTypeOfBudget = (budget, typeOfBudget) => {
	updateObjectProperty(budget, "typeOfBudget", typeOfBudget);
};
