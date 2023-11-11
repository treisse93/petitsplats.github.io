// recherche depuis la barre de recherche principale
function SearchFromMain(ValueToSearch, recipes) {
  const UpdatedRecipes = [];
  for (let i = 0; i < recipes.length; i += 1) {
    const recipe = recipes[i];
    const { ingredients } = recipe;
    const { name, description } = recipe;
    const ElementsToCheck = [name, description];
    for (let j = 0; j <= ingredients.length - 1; j += 1) {
      const ingr = ingredients[j];
      const { ingredient } = ingr;
      ElementsToCheck.push(ingredient);
    }
    for (let k = 0; k < ElementsToCheck.length; k += 1) {
      const element = ElementsToCheck[k];
      const normalizedKeyword = Normalized(ValueToSearch);
      const normalizedElement = Normalized(element);
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
function SearchFromIngredients(ValueToSearch, Actuals, recipes) {
  const UpdatedRecipes = [];
  for (let j = 0; j < recipes.length; j += 1) {
    const recipe = recipes[j];
    const { id: id1, ingredients } = recipe;
    for (let ActualRecipe of Actuals) {
      const { id: id2 } = ActualRecipe;
      if (Number(id1) === Number(id2)) {
        for (let k = 0; k < ingredients.length; k += 1) {
          const ingr = ingredients[k];
          const { ingredient } = ingr;
          const normalizedKeyword = Normalized(ValueToSearch);
          const normalizedElement = Normalized(ingredient);
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
    
//recherche depuis la barre de recherche du filtre ustensiles
function SearchFromUstensils(ValueToSearch, Actuals, recipes) {
  const updatedArray = [];
  const normalizedKeyword = Normalized(ValueToSearch);
  for (let ActualRecipe of Actuals) {
    const { id: id1 } = ActualRecipe;
    for (let recipe of recipes) {
      const { id: id2, ustensils } = recipe;
      if (Number(id1) === Number(id2)) {
        for (let ustensil of ustensils) {
          const normalizedElement = Normalized(ustensil);
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
function SearchFromAppliances(ValueToSearch, Actuals, recipes) {
  const updatedArray = [];
  const normalizedKeyword = Normalized(ValueToSearch);
  for (let ActualRecipe of Actuals) {
    for (let recipe of recipes) {
      const { id: id1, appliance } = recipe;
      const { id: id2 } = ActualRecipe;
      if (Number(id1) === Number(id2)) {
        const normalizedElement = Normalized(appliance);
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

//selection depuis la barre de recherche du filtre 
function SearchFromFilter(ValueToSearch, filterZone, recipes) {
  const Actuals = Array.from(document.querySelectorAll(".recipeCard"));
  let UpdatedRecipes;
  if (filterZone === "ingredients") {
    UpdatedRecipes = SearchFromIngredients(ValueToSearch, Actuals, recipes);
  } else if (filterZone === "appliances") {
    UpdatedRecipes = SearchFromAppliances(ValueToSearch, Actuals, recipes);
  } else if (filterZone === "ustensils") {
    UpdatedRecipes = SearchFromUstensils(ValueToSearch, Actuals, recipes);
    console.log(Actuals);
  }
  return UpdatedRecipes;
}

function SearchFromDeleteLabel(recipes) {
  // une fonction qui recuperes les labels et renvoi que les recettes qui contiennent l'ensemble des labels
  const labelsNodeList = document.querySelectorAll(".labels");
  let iteration = 0;
  let updatedRecipes = recipes;
  // Boucle for pour parcourir les labels
  for (let i = 0; i < labelsNodeList.length; i++) {
    const label = labelsNodeList[i];
    const name = label.getAttribute("data-normalized");
    const type = label.getAttribute("data-type");
    if (type === "ingredients") {
      updatedRecipes = SearchFromIngredients(name, updatedRecipes, recipes);
      iteration += 1;
    } else if (type === "ustensils") {
      updatedRecipes = SearchFromUstensils(name, updatedRecipes, recipes);
      iteration += 1;
    } else if (type === "appliances") {
      updatedRecipes = SearchFromAppliances(name, updatedRecipes, recipes);
      iteration += 1;
    }
  }
  return updatedRecipes;
}

function SearchListInput(filters, input) {
  // Fonction qui filtre les éléments de la liste des filtres
  if (input !== 0) {  
    for (let filter of filters) {
      const element = filter;
      const normalizedElement = Normalized(element.textContent); // nom de l'élément du filtre
      const normalizedInput = Normalized(input); //valeur du champ input du filtre recherche
console.log (normalizedElement);
console.log (normalizedInput);
console.log(!normalizedElement.match(normalizedInput)); 
      if (!normalizedElement.match(normalizedInput)) { //true ou false
        console.log(" ça passe pas");
        element.classList.add("d-none");
        element.classList.remove("d-flex");
      } else {
        console.log ("ca passe");
        element.classList.remove("d-none");
        element.classList.add("d-flex");
      }
    }
  }
}

// Fonction utilitaire pour normaliser les chaînes de caractères (enlever les accents et convertir en minuscules)
function Normalized(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "")
    .replace("'", "")
    .toLowerCase()
    .trim();
}

export {
  SearchFromFilter,
  SearchFromMain,
  SearchListInput,
  SearchFromDeleteLabel,
  Normalized,
};
