// Importation des modules depuis d'autres fichiers
import {
  DisplayRecipes,
  UpdateRecipes,
  Summarize,
} from '../controllers/RecipeControl.js';
import {GetAllFilters, UpdateFilters} from '../utils/filter.js';
import {SearchFromMain} from '../utils/search.js';
import {
  recipesArray,
  ingredientsObject,
  appliancesObject,
  ustensilesObject,
} from '../controllers/DataControl.js';

// Tableau qui contient tous les objets ingrédients, appareils et ustensiles
const fullArray = [ingredientsObject, appliancesObject, ustensilesObject];

// Sélectionne éléments HTML du DOM


/**
 * Fonction d'initialisation de l'application.
 */
// recherche dans la barre principale
function init() {
  const mainInput = document.getElementById("bannerSearchInput");
  DisplayRecipes(recipesArray); // Affiche toutes les recettes au chargement de la page
  GetAllFilters(fullArray); // Création: filtres de recherche.

  // Stocker le contenu initial de recipesCardsContainer
  const initialRecipesContainerHTML = document.getElementById("recipesCardsContainer").innerHTML;

  mainInput.addEventListener("keyup", (event) => {
    console.log (mainInput.value);
    // créer une constante mainInput.value pour récupérer la valeur
    const updatedFromMain = SearchFromMain(mainInput.value, recipesArray); 
    // Récupère: filtres correspondant à la recherche.
    
    const recipeContainer = document.getElementById("recipesCardsContainer");
    if (mainInput.value.length > 2) {
      // Si valeur de l'input recherche > à 2 caractères, affiche les recettes qui correspondent.
      if (updatedFromMain.length === 0) {
        // Si aucune recette ne correspond, affiche: message d'erreur.
        console.log (SearchFromMain);
        recipeContainer.innerHTML = `<p id='errorMsg'>
                                        Aucune recette ne correspond à <span>${mainInput.value}</span>, 
                                        vous pouvez chercher « tarte aux pommes », « poisson », 
                                        etc.</p>`;
console.log (recipeContainer);
console.log (updatedFromMain);
console.log (updatedFromMain.length === 0);
        //const output = document.getElementById("output");
       // output.textContent = mainInput.value;
        const labelsContainer = document.getElementById("labelsContainer");
        labelsContainer.innerHTML = ""; // Supprime: filtres de recherche.
        } else {
          //Affiche les recettes correspondantes
        Summarize(); // Affiche: résumé nombre de recettes.
        UpdateFilters(updatedFromMain); // Crée: filtres de recherche.
        UpdateRecipes(updatedFromMain); // Maj les recettes.
      }
    } else {
      // Si la valeur de l'input < à 3 caractères, affiche: toutes les recettes.
      DisplayRecipes(recipesArray);
      GetAllFilters(fullArray);
      
    }
    // Restaurer le contenu initial si nécessaire
    if (updatedFromMain.length !== 0) {
      recipeContainer.innerHTML = initialRecipesContainerHTML;
    }
  });
}
init(); // Appel: fonction d'initialisation
