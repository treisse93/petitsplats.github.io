// Importation des modules depuis d'autres fichiers
import {
  DisplayRecipes,
  UpdateRecipes,
  Summarize,
} from "../controllers/RecipeControl.js";
import { GetAllFilters, UpdateFilters } from "../utils/filter.js";
import { SearchFromMain } from "../utils/search.js";
import {
  recipesArray,
  ingredientsObject,
  appliancesObject,
  ustensilesObject,
} from "../controllers/DataControl.js";

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

  mainInput.addEventListener("keyup", (event) => {
    console.log (mainInput.value);
    // créer une constante mainInput.value pour récupérer la valeur
    const updatedFromMain = SearchFromMain(mainInput.value, recipesArray); 
    // Récupère: filtres correspondant à la recherche.

    if (mainInput.value.length > 2) {
      // Si valeur de l'input recherche > à 2 caractères, affiche les recettes qui correspondent.

      if (updatedFromMain.length > 0) {
        // Si aucune recette ne correspond, affiche: message d'erreur.
        const labelsContainer = document.getElementById("labelsContainer");
        labelsContainer.innerHTML = ""; // Supprime: filtres de recherche.
        UpdateRecipes(updatedFromMain); // Maj les recettes.
      } else {
        const recipeContainer = document.getElementById("recipesCardsContainer");
        recipeContainer.innerHTML = `<p id='errorMsg>
                                        Aucune recettes ne correspond à <span id = "output"></span> 
                                        vous pouvez chercher « tarte aux pommes », « poisson », 
                                        etc.</p>`;

        const output = document.querySelector("#output");
        output.textContent = mainInput.value;

        Summarize(); // Affiche: résumé nombre de recettes.
        UpdateFilters(updatedFromMain); // Crée: filtres de recherche.
      }
    } else {
      // Si la valeur de l'input < à 3 caractères, affiche: toutes les recettes.
      DisplayRecipes(recipesArray);
      GetAllFilters(fullArray);
    }
  });
}
init(); // Appel: fonction d'initialisation
