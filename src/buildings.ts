import { showModal } from "./main";
import { currentProd, updateProdMax } from "./stats";
import { updateNourriture } from "./stats";
import { updateBonheur } from "./stats";
import { updateArmee } from "./stats";
import { updateArgent } from "./stats";
import { updateStats } from "./stats";
import { argentNbr } from "./stats";
import { hideModal } from "./main";

const buildings: HTMLDivElement | null = document.getElementById(
  "buildings"
) as HTMLDivElement;
const buildModal: HTMLDivElement | null = document.getElementById(
  "buildModal"
) as HTMLDivElement;
const buildModalContent: HTMLDivElement | null = document.getElementById(
  "buildModalContent"
) as HTMLDivElement;
interface Effect {
  type: string;
  modif: string;
  value: number;
}

export interface Building {
  id: number;
  name: string;
  text: string;
  sprite: string;
  cost: number;
  condition: string;
  effects: Effect[];
}

let allBuildings: Building[] = [];
export let selectedBuilding: Building | null = null;

export async function fetchBuildings() {
  try {
    const response = await fetch("./json/buildings.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Données JSON brutes chargées :", data);
    if (data && data.buildings && Array.isArray(data.buildings)) {
      allBuildings = data.buildings;
      console.log(allBuildings);
    } else {
      console.error(
        "Le format JSON n'est pas celui attendu ou 'allBuildings' n'est pas un tableau."
      );
      allBuildings = [];
    }
  } catch (error) {
    console.error("Erreur de chargement des bâtiments :", error);
    allBuildings = [];
  }
}

export function refreshBuildings() {
  if (buildings) {
    buildings.innerHTML = "";
  }

  allBuildings.forEach((building: Building) => {
    const newBuildingDiv = document.createElement("div");
    newBuildingDiv.classList.add(
      "h-[20%]",
      "w-[100%]",
      "flex",
      "flex-row",
      "items-center"
    );

    const buildDivChild = document.createElement("div");
    buildDivChild.classList.add("w-[70%]", "flex", "flex-row", "items-center");

    const buildImg = document.createElement("img");
    buildImg.src = building.sprite;
    buildImg.classList.add("w-14");

    const buildName = document.createElement("p");
    buildName.textContent = building.name;
    buildName.classList.add("text-xl", "font-semibold", "ml-2");

    const buildCost = document.createElement("p");
    buildCost.textContent = building.cost.toString();
    buildCost.classList.add(
      "text-xl",
      "font-semibold",
      "ml-4",
      "text-yellow-300"
    );

    const buildDollarImg = document.createElement("img");
    buildDollarImg.src = "/img/dollar.png";
    buildDollarImg.classList.add("w-8", "ml-2");

    const buyBttn = document.createElement("button");
    buyBttn.textContent = "ACHETER";
    buyBttn.classList.add("button", "ml-18");

    buildDivChild.appendChild(buildImg);
    buildDivChild.appendChild(buildName);
    buildDivChild.appendChild(buildCost);
    buildDivChild.appendChild(buildDollarImg);
    newBuildingDiv.appendChild(buildDivChild);
    newBuildingDiv.appendChild(buyBttn);

    buildings?.appendChild(newBuildingDiv);

    buildDivChild.addEventListener("click", () => {
      showBuildModal(building);
    });

    buyBttn.addEventListener("click", () => {
      if (checkBuildCondition(building)) {
        selectTile(building);
      }
    });
  });
}

function selectTile(building: Building) {
  selectedBuilding = building;
}

export function checkBuildCondition(building: Building) {
  const cost: number = building.cost;
  const condition: string = building.condition;
  if (currentProd > 0 && argentNbr >= cost) {
    return true;
  } else {
    alert("tu ne peux plus construire ou tu n'as pas assez de MONEY!");
    return false;
  }
}

export function placeBuilding(cell: HTMLDivElement, building: Building) {
  const buildImg = document.createElement("img");
  buildImg.src = building.sprite;
  buildImg.classList.add("building-placed");

  cell.appendChild(buildImg);
  cell.dataset.building = building.name;

  updateArgent(-building.cost);
}

export function applyBuildingEffetcs(
  building: Building | null,
  cell: HTMLDivElement
) {
  if (!building) {
    console.warn("applyBuildingEffetcs appelé sans bâtiment valide");
    return;
  }
  console.log(building.effects);
  building.effects?.forEach((effect: Effect) => {
    if (effect.type === "stats") {
      switch (effect.modif.toString()) {
        case "nourriture":
          if (cell.getAttribute("owned") == "true") {
            updateNourriture(effect.value * 2);
          } else {
            updateNourriture(effect.value ?? 0);
          }
          break;
        case "bonheur":
          if (cell.getAttribute("owned") == "true") {
            updateBonheur(effect.value * 2);
          } else {
            updateBonheur(effect.value ?? 0);
          }
          break;
        case "argent":
          if (cell.getAttribute("owned") == "true") {
            updateArgent(effect.value * 2);
          } else {
            updateArgent(effect.value ?? 0);
          }
          break;
        case "armee":
          if (cell.getAttribute("owned") == "true") {
            updateArmee(effect.value * 2);
          } else {
            updateArmee(effect.value ?? 0);
          }
          break;
        case "production":
          if (cell.getAttribute("owned") == "true") {
            updateProdMax(effect.value * 2);
          } else {
            updateProdMax(effect.value ?? 0);
          }
          break;
        default:
          console.log("Aucun effet correspondant");
          break;
      }
    }
  });
  updateStats();
}

export function reinitializeSelectedBuilding() {
  selectedBuilding = null;
}

function showBuildModal(building: Building) {
  if (buildModal) {
    showModal("buildModal");
    window.onclick = function (event) {
      if (event.target == buildModal) {
        hideModal("buildModal");
      }
    };
  }
  if (buildModalContent) {
    buildModalContent.innerHTML = "";

    const buildEffectDiv = document.createElement("div");
    buildEffectDiv.classList.add("mt-12");

    const buildTitle = document.createElement("h3");
    buildTitle.textContent = building.name;
    buildTitle.classList.add("text-3xl", "font-bold");
    buildModalContent.appendChild(buildTitle);

    const buildImg = document.createElement("img");
    buildImg.src = building.sprite;
    buildImg.classList.add("w-48", "mt-8");
    buildModalContent.appendChild(buildImg);

    const buildText = document.createElement("p");
    buildText.textContent = building.text;
    buildText.classList.add("mt-8");
    buildModalContent.appendChild(buildText);

    const buildCost = document.createElement("p");
    buildCost.textContent = "Coût : " + building.cost.toString();
    buildCost.classList.add("text-xl", "mt-8");
    buildModalContent.appendChild(buildCost);

    building.effects.forEach((effect: Effect) => {
      const buildEffect = document.createElement("p");
      buildEffect.textContent = effect.modif + " : " + effect.value;
      buildEffect.classList.add("text-xl");
      buildEffectDiv.appendChild(buildEffect);
    });

    buildModalContent.appendChild(buildEffectDiv);
  }
}
