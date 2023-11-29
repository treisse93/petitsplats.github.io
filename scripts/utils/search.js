// recherche depuis la barre de recherche principale
/**
 *
 * @param {string} ValueToSearch
 * @param {string} recipes
 * @return {string}
 */
function searchFromMain(ValueToSearch, recipes) {
  return recipes.filter((recipe) => {
    const {ingredients, name, description} = recipe;
    const ToCheck = [
      name,
      description,
      ...ingredients.map((ing) => ing.ingredient),
    ];// affiche nom recette , description, ingrédients
    return ToCheck.some((element) =>
      normalized(element).match(normalized(ValueToSearch)),
    );
  });
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
  const normalizedKeyword = normalized(ValueToSearch);
  return recipes
      .filter((recipe) =>
        recipe.ingredients.some(
            (ingr) => normalized(ingr.ingredient) === normalizedKeyword,
        ),
      )
      .filter((recipe) =>
        Actuals.some((Recipe) => Number(Recipe.id) === Number(recipe.id)),
      );
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
  const normalizedKeyword = normalized(ValueToSearch);

  return recipes
      .filter((recipe) =>
        recipe.ustensils.some(
            (Ustensil) => normalized(Ustensil) === normalizedKeyword,
        ),
      )
      .filter((recipe) =>
        Actuals.some((Recipe) => Number(Recipe.id) === Number(recipe.id)),
      );
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
  const normalizedKeyword = normalized(ValueToSearch);
  return recipes
      .filter((recipe) => normalized(recipe.appliance) === normalizedKeyword)
      .filter((recipe) =>
        Actuals.some((Recipe) => Number(Recipe.id) === Number(recipe.id)),
      );
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
  // une fonction qui recuperes les labels et
  // renvoi que les recettes qui contiennent l'ensemble des labels
  const ActualsLabel = Array.from(document.querySelectorAll('.labels'));
  // let iteration = 0;
  let updatedRecipes = recipes;

  ActualsLabel.forEach((label) => {
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
  });
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
 * @param {string} str
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
