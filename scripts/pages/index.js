// Importation des modules depuis d'autres fichiers
import {
  displayRecipes,
  updateRecipes,
  summarize,
} from '../controllers/RecipeControl.js';
import {getAllFilters, updateFilters} from '../utils/filter.js';
import {searchFromMain} from '../utils/search.js';
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
 *
 */
// recherche dans la barre principale
function init() {
  const mainInput = document.getElementById('bannerSearchInput');
  displayRecipes(recipesArray);
  // Affiche toutes les recettes au chargement de la page
  getAllFilters(fullArray); // Création: filtres de recherche.

  // Stocker le contenu initial de recipesCardsContainer
  const initialRecipesContainerHTML =
  document.getElementById('recipesCardsContainer').innerHTML;
  // verif si pas de plantage

  mainInput.addEventListener('keyup', (event) => {
    // créer une constante mainInput.value pour récupérer la valeur
    const updatedFromMain = searchFromMain(mainInput.value, recipesArray);
    // Récupère: filtres correspondant à la recherche.

    const recipeContainer = document.getElementById('recipesCardsContainer');
    if (mainInput.value.length > 2) {
      // Si valeur de l'input recherche > à 2 caractères,
      // affiche les recettes qui correspondent.
      if (updatedFromMain.length === 0) {
        // Si aucune recette ne correspond, affiche: message d'erreur.
        recipeContainer.innerHTML = `<p id='errorMsg'>
                                      Aucune recette ne correspond à 
                                      <span>${mainInput.value}</span>, 
                                      vous pouvez chercher 
                                      « tarte aux pommes », « poisson », 
                                      etc.</p>`;
        const labelsContainer = document.getElementById('labelsContainer');
        labelsContainer.innerHTML = ''; // Supprime: filtres de recherche.
      } else {
        // Affiche les recettes correspondantes
        summarize(); // Affiche: résumé nombre de recettes.
        updateFilters(updatedFromMain); // Crée: filtres de recherche.
        updateRecipes(updatedFromMain); // Maj les recettes.
      }
    } else {
      // Si la valeur de l'input < à 3 caractères, affiche: toutes les recettes.
      displayRecipes(recipesArray);
      getAllFilters(fullArray);
    }
    // Restaurer le contenu initial si nécessaire
    if (updatedFromMain.length !== 0) {
      recipeContainer.innerHTML = initialRecipesContainerHTML;
    }
  });
}
init(); // Appel: fonction d'initialisation