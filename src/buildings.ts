import { currentProd } from "./stats";
import { updateNourriture } from "./stats";
import { updateBonheur } from "./stats";
import { updateArmee } from "./stats";
import { updateArgent } from "./stats";
import { updateStats } from "./stats";

const buildings: HTMLDivElement | null = document.getElementById(
  "buildings"
) as HTMLDivElement;

interface Effect {
  type: string;
  modif: string;
  value: number;
}

export interface Building {
  id: number;
  name: string;
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
    if(buildings){
buildings.innerHTML = ""
    }
    
  allBuildings.forEach((building: Building) => {
    const newBuildingDiv = document.createElement("div");
    newBuildingDiv.classList.add("h-[15%]", "flex", "flex-row", "items-center");

    const buildImg = document.createElement("img");
    buildImg.src = building.sprite;
    buildImg.classList.add("w-14");

    const buildName = document.createElement("p");
    buildName.textContent = building.name;
    buildName.classList.add("text-xl", "font-semibold");

    const buyBttn = document.createElement("button");
    buyBttn.textContent = "ACHETER";
    buyBttn.classList.add("button", "ml-24");

    newBuildingDiv.appendChild(buildImg);
    newBuildingDiv.appendChild(buildName);
    newBuildingDiv.appendChild(buyBttn);

    buildings?.appendChild(newBuildingDiv);

    buyBttn.addEventListener("click", () => {
      selectTile(building);
    });
  });
}

function selectTile(building: Building) {
  selectedBuilding = building;
}

export function checkBuildCondition(building: Building) {
    const condition : string = building.condition
    if(currentProd > 0){
     return true;
    } else {
        alert("tu ne peux plus construire!")
        return false;
    }
}

export function placeBuilding(cell: HTMLDivElement, building: Building) {
  const buildImg = document.createElement("img");
  buildImg.src = building.sprite;
  buildImg.classList.add("building-placed");

  cell.appendChild(buildImg);
  cell.dataset.building = building.name;
}

export function applyBuildingEffetcs(building: Building | null) {
  if (!building) {
    console.warn("applyBuildingEffetcs appelé sans bâtiment valide");
    return;
  }
console.log(building.effects)
  building.effects?.forEach((effect: Effect) => {
    if (effect.type === "stats") {
      switch (effect.modif.toString()) {
        case "nourriture":
          updateNourriture(effect.value ?? 0);
          break;
        case "bonheur":
          updateBonheur(effect.value ?? 0);
          break;
        case "argent":
          updateArgent(effect.value ?? 0);
          break;
        case "armee":
          updateArmee(effect.value ?? 0);
          break;
        default:
          console.log("Aucun effet correspondant");
          break;
      }
    }
  });
  updateStats();
}

export function reinitializeSelectedBuilding(){
    selectedBuilding = null
}

