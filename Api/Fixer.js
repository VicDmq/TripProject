//Api utilisée pour la gestion des devises
const accessKey = "671ff47a2641f604431c12e81efde1a3";

export const getRatesFromEuro = async () => {
	//Une seule requête gratuite : liste des valeurs des monnaies par rapport à l'euro
	const url = "http://data.fixer.io/api/latest?access_key=" + accessKey + "&base=EUR";
	try {
		let response = await fetch(url);
		let responseJSON = await response.json();
		if (responseJSON.success === true) {
			return responseJSON.rates;
		} else {
			//Si nombre de requêtes dépassées (1000)
			//Ou ne fonctionnera pas sur Iphone car fetch ne fonctionne qu'avec HTTPS (version payante nécessaire)
			//Pour palier à ce problème, je créerai un fichier avec des valeurs standards
			return {};
		}
	} catch (error) {
		return {};
	}
};
