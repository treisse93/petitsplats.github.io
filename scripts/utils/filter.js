// Importation: classes et fonctions nécessaires depuis d'autres fichiers
import {
  SearchFromDeleteLabel,
  SearchFromFilter,
  SearchListInput,
  Normalized,
} from "../utils/search.js";
import { UpdateRecipes } from "../controllers/RecipeControl.js";
import { recipesArray } from "../controllers/DataControl.js";
import Label from "../utils/label.js";

// éléments HTML à utiliser pour la gestion des filtres
const filterIngredientsList = document.getElementById("ingredientsList");
const filterApplianceList = document.getElementById("appliancesList");
const filterUstensilsList = document.getElementById("ustensilsList");
const filterZones = document.querySelectorAll(".filterBtn");
const mainInput = document.getElementById("bannerSearchButton");

/** Classe Filter */


filterZones.forEach((btn) => {
  const input = btn.querySelector("input");
  const list = btn.querySelector(".filterList");
  
  input.addEventListener("click", (e) => {
    console.log(e.target.value);
    e.stopPropagation();
    input.focus();
  });
  
  input.addEventListener("keyup", (event) => {
    console.log(event.target.value); //valeur du champ input filtre
    const filtersArray = Array.from(list.querySelectorAll(".filterOption"));
    console.log(filtersArray); //liste de toutes les recettes possibles
    SearchListInput(filtersArray, input.value);
  });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = btn.classList.contains("active");
    const allActiveFilters = document.querySelectorAll(".filter.active");
  
    if (!isActive) {
      const btnID = btn.id.replace("Filter", "");
      allActiveFilters.forEach((filter) => {
        const filterID = filter.id.replace("Filter", "");
        toggleList(filterID);
      });
    
      toggleList(btnID);
    } else {
      toggleList(btn.id.replace("Filter", ""));
    }
  });
});

class Filter {
  constructor(name, type) {
    this.NAME = name;
    this.TYPE = type;
    this.RAWNAME = this.NAME.charAt(0).toUpperCase() + this.NAME.slice(1);
    this.NORMALIZED = Normalized(this.RAWNAME);
    this.ID = `Filter-${this.NORMALIZED}`;
  }

  SetFilter() {
    // Crée: élément HTML pour le filtre (cliqué- apparait en jaune)

    this.LABELID = `label-${this.NORMALIZED}`;
    this.ELEMENT = document.createElement("div");
    this.LIST = document.getElementById(`${this.TYPE}List`);
    this.ELEMENT.setAttribute("id", this.ID);
    this.ELEMENT.setAttribute("data-Normalized", this.NORMALIZED);
    this.ELEMENT.setAttribute("data-name", this.RAWNAME);
    this.ELEMENT.setAttribute("data-type", this.TYPE);
    this.ELEMENT.innerHTML = `<p class='FilterName'>${this.RAWNAME}</p><i class=" fa-solid fa-circle-xmark filter-Icon "></i>`;
    this.ELEMENT.classList.add("filterOption");
    this.ICON = this.ELEMENT.querySelector(".filter-Icon");
    this.AddListener();
    this.AddToList();
  }
  

  SetActive() {
    // Active le filtre - crée le label à gauche
    this.ELEMENT.classList.add("active");

    this.AddLabel();
    SearchAndUpdate(this.NAME, this.TYPE, recipesArray);
  }

  SetInactive() {
    // Désactive le filtre lors du click sur le label ou sur la ligne de l'élément dans le filtre
    this.ELEMENT = document.getElementById(this.ID);
    this.ELEMENT.classList.remove("active");
    this.ELEMENT.innerHTML = this.INACTIVE;
    this.RemoveLabel();

    const UpdatedRecipes = SearchFromDeleteLabel(
      recipesArray,
      Normalized(mainInput.value)      
    );
    UpdateRecipes(UpdatedRecipes); // maj recettes
    UpdateFilters(UpdatedRecipes); //maj liste
    RestoreActive();
  }

  SetHovered() {
    // Evenement survol du filtre
    if (!this.ISACTIVE) {
      this.ELEMENT.addEventListener("mouseover", () => {
        this.ELEMENT.classList.add("hovered");
      });

      this.ELEMENT.addEventListener("mouseout", () => {
        this.ELEMENT.classList.remove("hovered");
      });
    }
  }

  SetClick() {
    // Evenement clic sur le filtre
    this.ELEMENT.addEventListener("click", (e) => {
      e.stopPropagation();
      this.ISACTIVE = this.ELEMENT.classList.contains("active");
      if (!this.ISACTIVE) {
        this.SetActive();
        document.querySelectorAll(".filterInput").forEach(filterInput => {
          console.log(filterInput);
          filterInput.value = "";
          console.log(filterInput.value);
        });
              
      } else if (this.ISACTIVE && e.target.classList.contains("filter-Icon")) {
        this.SetInactive();
       
        
      }
    });
  }

  AddLabel() { // ajoute label à gauche 
    const labelToAdd = new Label(this.NAME, this.TYPE);
    labelToAdd.SetLabel();
    labelToAdd.Mount();

    const LabelIcon = labelToAdd.ELEMENT.querySelector(".label-Icon");

    LabelIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      this.SetInactive();
    });
  }

  RemoveLabel() {// enlève le label à gauche
    const labelToRemove = document.getElementById(this.LABELID);
    if (labelToRemove) {
      labelToRemove.remove();
    } else {
      console.error("Label element not found or already removed.");
    }
  }

  AddListener() { //ajoute un event
    this.SetClick();
    this.SetHovered();
  }

  AddToList() {
    if (this.TYPE === "ingredients") {
      filterIngredientsList.appendChild(this.ELEMENT);
    } else if (this.TYPE === "appliances") {
      filterApplianceList.appendChild(this.ELEMENT);
    } else if (this.TYPE === "ustensils") {
      filterUstensilsList.appendChild(this.ELEMENT);
    }
  }
}

document.querySelector("html").addEventListener("click", (e) => {
  const activeFilter = document.querySelector(".filter.active");
  const activeBtnID = activeFilter?.id.replace("Filter", ""); //affiche catégorie (ign, ust, app) du label 
  if (activeFilter) {
    if (e.target.id !== activeFilter.id) {
      // Si élément cliqué n'est pas un filtre actif
      toggleList(activeBtnID); // Ferme le filtre actif
    } else if (e.target.classList.contains("filter:not(active)")) {
      // Si élément cliqué est un filtre inactif
      toggleList(activeBtnID); // Ferme le filtre actif
      toggleList(e.target.id); // Ouvre le filtre inactif sur lequel l'utilisateur a cliqué
    }
  }
});

function SearchAndUpdate(name, type, recipes) {
  UpdateRecipes(SearchFromFilter(name, type, recipes)); // maj recettes
 UpdateFilters(SearchFromFilter(name, type, recipes)); // maj onglet filtre (filtre actif seulement)
  RestoreActive(); 
}

function RestoreActive() {
  const CurrentLabels = document.querySelectorAll(".labels");
  const CurrentFilters = document.querySelectorAll(".filterOption");

  if (CurrentLabels) {
    for (const CurrentLabel of CurrentLabels) {
      const NormalizedLabel = CurrentLabel.getAttribute("data-normalized");

      for (const CurrentFilter of CurrentFilters) {
        const NormalizedFilter = CurrentFilter.getAttribute("data-normalized");
        const RAWNAME = CurrentFilter.getAttribute("data-name");

        if (NormalizedLabel === NormalizedFilter) {
          CurrentFilter.classList.add("active");
        }
      }
    }
  }
}

/** Fonction: crée tous les filtres.
 * @param {Array} Array - Tableau contenant les filtres à créer
 */
function GetAllFilters(Array) {
  // Parcourt chaque élément de fullArray et appelle GetFilters pour chaque élément.

  Array.forEach((obj) => {
    const arrayName = Object.keys(obj)[0];
    const arrayFilter = Object.values(obj)[0].sort((a, b) => a.localeCompare(b));
    const list = document.getElementById(`${arrayName}List`);
    const oldActualFilters = list.querySelectorAll('.filterOption');
    oldActualFilters.forEach((oldActualFilter) => {
      oldActualFilter.remove();
    });

    GetFilters({ [arrayName]: arrayFilter });
  });
}

/** Fonction: crée un filtre pour un objet donné.
 * @param {Object} Obj - L'objet pour lequel on veut créer un filtre
 */
function GetFilters(Obj) {
  const arrayName = Object.keys(Obj)[0];
  const arrayFull = Object.values(Obj)[0].sort((a, b) => a.localeCompare(b));

  arrayFull.forEach((ActualFilter) => {
    // Parcourt chaque élément du tableau et crée un élément HTML pour chaque élément.
    const isExist = document.getElementById(`${ActualFilter}Filter`);
    if (!isExist) {
      const filter = new Filter(ActualFilter, arrayName);
      filter.SetFilter();
    }
  });
}

/** Fonction: affiche ou cache la liste de filtre.
 * @param {string} FilterID - Le nom du bouton de filtre
 */
function toggleList(FilterID) {
  const list = document.getElementById(`${FilterID}List`);
  const btn = document.getElementById(`${FilterID}`);
  const zone = document.getElementById(`${FilterID}Filter`);
  const input = list.firstElementChild.querySelector("input");

  list.classList.toggle("active");
  list.classList.toggle("hidden");
  btn.classList.toggle("active");
  zone.classList.toggle("active");
  btn.querySelector("i").classList.toggle("fa-chevron-down");
  btn.querySelector("i").classList.toggle("fa-chevron-up");
  if (list.classList.contains("active")) {
    input.value = "";
  }
}

/** Fonction: met à jour les filtres en fonction des recettes filtrées.
 * @param {Array} UpdatedFilter - Le tableau contenant les recettes filtrées
 * @returns {Array} - Le tableau mis à jour des éléments de filtre
 */
function UpdateFilters(UpdatedFilter) {
  const NewappliancesArray = [];
  const NewIngredientsArray = [];
  const NewUstensilesArray = [];

  for (const recipe of UpdatedFilter) {
    const { appliance, ingredients, ustensils } = recipe;
    const normalizedAppliance = Normalized(appliance);

    if (!NewappliancesArray.includes(normalizedAppliance)) {
      NewappliancesArray.push(appliance.toLowerCase());
    }

    for (const ingredient of ingredients) {
      const normalizedIngredient = Normalized(ingredient.ingredient);
      const loweredIngr = ingredient.ingredient.toLowerCase();
      if (!NewIngredientsArray.includes(normalizedIngredient)) {
        NewIngredientsArray.push(loweredIngr);
      }
    }

    for (const ustensil of ustensils) {
      const normalizedUstensil = Normalized(ustensil);

      if (!NewUstensilesArray.includes(normalizedUstensil)) {
        NewUstensilesArray.push(ustensil.toLowerCase());
      }
    }
  }

  const finalAppliancesArray = [...new Set(NewappliancesArray)];
  const finalIngredientsArray = [...new Set(NewIngredientsArray)];
  const finalUstensilesArray = [...new Set(NewUstensilesArray)];

  const UpdatedFilterApplicances = { appliances: finalAppliancesArray };
  const UpdatedFilterIngredients = { ingredients: finalIngredientsArray };
  const UpdatedFilterUstensiles = { ustensils: finalUstensilesArray };
  const UpdatedActualFilter = [
    UpdatedFilterIngredients,
    UpdatedFilterApplicances,
    UpdatedFilterUstensiles,
  ];

  GetAllFilters(UpdatedActualFilter);
}

// Exportation des fonctions pour les rendre disponibles dans d'autres fichiers
export { GetAllFilters, GetFilters, UpdateFilters, SearchAndUpdate };
