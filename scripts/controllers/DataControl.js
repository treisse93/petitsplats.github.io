const DataRecipes = '../../Data/recipes.json';

/**
 * Récupère données du fichier JSON.
 * @return {Promise<Object>} Les données JSON.
 */
async function getDatas() {
  try {
    const response = await fetch(DataRecipes);

    if (!response.ok) {
      if (response.status === 404) throw new Error('Aucun fichier trouvé');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  const response = await fetch(DataRecipes);
  const datas = await response.json();

  return datas;
}

/**
 * Récupère tous les ingrédients disponibles.
 * @return {Object} L'objet contenant tous les ingrédients.
 */
function getFullIngredients() {
  const ingredientsArray = [];
  recipesArray.forEach((recipeObject) => {
    const {ingredients} = recipeObject;
    ingredients.forEach((ingredientObject) => {
      const {ingredient} = ingredientObject;
      if (!ingredientsArray.includes(ingredient.toLowerCase())) {
        ingredientsArray.push(ingredient.toLowerCase());
      }
    });
  });

  const finalIngredientsArray = {'ingredients': ingredientsArray};
  return finalIngredientsArray;
}

/**
 * Récupère tout le matériel (appareils) disponible.
 * @return {Object} L'objet contenant tout le matériel.
 */
function getFullAppliances() {
  const appliancesArray = [];
  recipesArray.forEach((recipe) => {
    const {appliance} = recipe;
    if (!appliancesArray.includes(appliance.toLowerCase())) {
      appliancesArray.push(appliance.toLowerCase());
    }
  });

  const finalAppliancesObject = {'appliances': appliancesArray};
  return finalAppliancesObject;
}
/**
 * Récupère tous les ustensiles disponibles.
 * @return {Object} L'objet contenant tous les ustensiles.
 */
function getFullUstensils() {
  const ustensilsArray = [];
  recipesArray.forEach((recipe) => {// liste complète
    const {ustensils} = recipe; // liste ustensils pour la recette
    ustensils.forEach((ustensil) => {// mentionne chaque ustensils de la recette
      if (!ustensilsArray.includes(ustensil.toLowerCase())) {
        ustensilsArray.push(ustensil.toLowerCase());
      }
    });
  });

  const finalUstensilsObject = {'ustensils': ustensilsArray};
  return finalUstensilsObject;
}


// Récupère données, ingrédients, matériel et des ustensiles
const recipesArray = await getDatas();
const ingredientsObject = getFullIngredients();
const appliancesObject = getFullAppliances();
const ustensilesObject = getFullUstensils();
export {recipesArray, ingredientsObject, appliancesObject, ustensilesObject};