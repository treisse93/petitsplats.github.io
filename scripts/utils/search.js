// recherche depuis la barre de recherche principale
/**
 *
 * @param {string} ValueToSearch
 * @param {string} recipes
 * @return {string}
 */
function searchFromMain(ValueToSearch, recipes) {
  const UpdatedRecipes = [];
  for (let i = 0; i < recipes.length; i += 1) {
    const recipe = recipes[i];
    const {ingredients} = recipe;
    const {name, description} = recipe;
    const ElementsToCheck = [name, description];
    for (let j = 0; j <= ingredients.length - 1; j += 1) {
      const ingr = ingredients[j];
      const {ingredient} = ingr;
      ElementsToCheck.push(ingredient);
    }
    for (let k = 0; k < ElementsToCheck.length; k += 1) {
      const element = ElementsToCheck[k];
      const normalizedKeyword = normalized(ValueToSearch);
      const normalizedElement = normalized(element);
      if (
        normalizedElement.match(normalizedKeyword) &&
        !UpdatedRecipes.includes(recipe)
      ) {
        UpdatedRecipes.push(recipe);
      }
    }
  }
  return UpdatedRecipes;
}

// recherche depuis la barre de recherche du filtre ingredient
/**
 *
 * @param {string} ValueToSearch
 * @param {string} Actuals
 * @param {string} recipes
 * @return {string}
 */
function searchFromIngredients(ValueToSearch, Actuals, recipes) {
  const UpdatedRecipes = [];
  for (let j = 0; j < recipes.length; j += 1) {
    const recipe = recipes[j];
    const {id: id1, ingredients} = recipe;
    for (const ActualRecipe of Actuals) {
      const {id: id2} = ActualRecipe;
      if (Number(id1) === Number(id2)) {
        for (let k = 0; k < ingredients.length; k += 1) {
          const ingr = ingredients[k];
          const {ingredient} = ingr;
          const normalizedKeyword = normalized(ValueToSearch);
          const normalizedElement = normalized(ingredient);
          if (normalizedElement === normalizedKeyword) {
            if (!UpdatedRecipes.includes(recipe)) {
              UpdatedRecipes.push(recipe);
            }
          }
        }
      }
    }
  }
  return UpdatedRecipes;
}


// recherche depuis la barre de recherche du filtre ustensiles
/**
 *
 * @param {string} ValueToSearch
 * @param {string} Actuals
 * @param {string} recipes
 * @return {string}
 */
function searchFromUstensils(ValueToSearch, Actuals, recipes) {
  const updatedArray = [];
  const normalizedKeyword = normalized(ValueToSearch);
  for (const ActualRecipe of Actuals) {
    const {id: id1} = ActualRecipe;
    for (const recipe of recipes) {
      const {id: id2, ustensils} = recipe;
      if (Number(id1) === Number(id2)) {
        for (const ustensil of ustensils) {
          const normalizedElement = normalized(ustensil);
          console.log(normalizedElement);
          console.log(normalizedKeyword);
          if (normalizedElement === normalizedKeyword) {
            if (!updatedArray.includes(recipe)) {
              updatedArray.push(recipe);
            }
          }
        }
      }
    }
  }
  return updatedArray;
}

// recherche depuis la barre de recherche du filtre appareils
/**
 *
 * @param {string} ValueToSearch
 * @param {string} Actuals
 * @param {string} recipes
 * @return {string}
 */
function searchFromAppliances(ValueToSearch, Actuals, recipes) {
  const updatedArray = [];
  const normalizedKeyword = normalized(ValueToSearch);
  for (const ActualRecipe of Actuals) {
    for (const recipe of recipes) {
      const {id: id1, appliance} = recipe;
      const {id: id2} = ActualRecipe;
      if (Number(id1) === Number(id2)) {
        const normalizedElement = normalized(appliance);
        if (
          normalizedElement === normalizedKeyword &&
          !updatedArray.includes(recipe)
        ) {
          updatedArray.push(recipe);
        }
      }
    }
  }
  return updatedArray;
}

// selection depuis la barre de recherche du filtre
/**
 *
 * @param {string} ValueToSearch
 * @param {string} filterZone
 * @param {string} recipes
 * @return {string}
 */
function searchFromFilter(ValueToSearch, filterZone, recipes) {
  const Actuals = Array.from(document.querySelectorAll('.recipeCard'));
  let UpdatedRecipes;

  if (filterZone === 'ingredients') {
    UpdatedRecipes = searchFromIngredients(ValueToSearch, Actuals, recipes);
  } else if (filterZone === 'appliances') {
    UpdatedRecipes = searchFromAppliances(ValueToSearch, Actuals, recipes);
  } else if (filterZone === 'ustensils') {
    UpdatedRecipes = searchFromUstensils(ValueToSearch, Actuals, recipes);
    console.log(Actuals);
  }
  return UpdatedRecipes;
}

/**
 *
 * @param {string} recipes
 * @return {string}
 */
function searchFromDeleteLabel(recipes) {
  // une fonction qui recuperes les labels
  // et renvoi que les recettes qui contiennent l'ensemble des labels
  const labelsNodeList = document.querySelectorAll('.labels');
  let iteration = 0;
  let updatedRecipes = recipes;
  // Boucle for pour parcourir les labels
  for (let i = 0; i < labelsNodeList.length; i++) {
    const label = labelsNodeList[i];
    const name = label.getAttribute('data-normalized');
    const type = label.getAttribute('data-type');
    if (type === 'ingredients') {
      updatedRecipes = searchFromIngredients(name, updatedRecipes, recipes);
      iteration += 1;
    } else if (type === 'ustensils') {
      updatedRecipes = searchFromUstensils(name, updatedRecipes, recipes);
      iteration += 1;
    } else if (type === 'appliances') {
      updatedRecipes = searchFromAppliances(name, updatedRecipes, recipes);
      iteration += 1;
    }
  }
  return updatedRecipes;
}

/**
 *
 * @param {*} filters
 * @param {*} input
 */
function searchListInput(filters, input) {
  // Fonction qui filtre les éléments de la liste des filtres

  if (input !== 0) {
    for (const filter of filters) {
      const element = filter;
      const normalizedElement = normalized(element.textContent);
      // nom de l'élément du filtre
      const normalizedInput = normalized(input);
      // valeur du champ input du filtre recherche
      if (!normalizedElement.match(normalizedInput)) { // true ou false
        element.classList.add('d-none');
        element.classList.remove('d-flex');
      } else {
        element.classList.remove('d-none');
        element.classList.add('d-flex');
      }
    }
  }
}

// Fonction utilitaire pour normaliser les chaînes de caractères
// (enlever les accents et convertir en minuscules)
/**
 *
 * @param {str}
 * @return {string}
 */
function normalized(str) {
  if (typeof str === 'string' || str instanceof String) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replaceAll(' ', '')
        .replace('', '')
        .toLowerCase()
        .trim();
  } else {
    return '';
    // Retourne une chaîne vide si la valeur
    // n'est pas une chaîne de caractères
  }
}

export {
  searchFromFilter,
  searchFromMain,
  searchListInput,
  searchFromDeleteLabel,
  normalized,
};
