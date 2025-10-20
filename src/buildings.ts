import { showModal, updateUi } from "./ui";
import { changeBooleanState, currentProd, decreaseNourriturePerTurn, updateProdMax } from "./stats";
import { updateNourriture } from "./stats";
import { updateBonheur } from "./stats";
import { updateArmee } from "./stats";
import { updateArgent } from "./stats";
import { updateStats } from "./stats";
import { argentNbr, nourritureNbr } from "./stats";
import { updateCurrentProd } from "./stats";
import { hideModal } from "./ui";
import { invasionNameDisplay, updateInvasionName } from "./time";

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

interface Cost {
  type: string;
  value: number
}

export interface Building {
  id: number;
  name: string;
  text: string;
  sprite: string;
  cost: Cost[];
  condition: string;
  effects: Effect[];
}

let allBuildings: Building[] = [];
export let selectedBuilding: Building | null = null;

let watchtower : boolean = false
let moulin : boolean = false

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
    buildImg.classList.add("w-10");

    const buildName = document.createElement("p");
    buildName.textContent = building.name;
    buildName.classList.add("text-xl", "font-semibold", "ml-2");

    const cost = building.cost[0]; 
    const buildCost = document.createElement("p");
    buildCost.textContent = `${cost.value > 0 ? "-" : ""}${cost.value}`;
    buildCost.classList.add(
      "text-xl",
      "font-semibold",
      "ml-4",
      cost.type === "argent" ? "text-yellow-300" : "text-green-400"
    );

   
    let costIcon: HTMLImageElement | null = null;

    switch (cost.type) {
      case "argent":
        costIcon = document.createElement("img");
        costIcon.src = "/img/dollar.png";
        costIcon.classList.add("w-4", "ml-2");
        break;
      case "nourriture":
        costIcon = document.createElement("img");
        costIcon.src = "/img/apple.png";
        costIcon.classList.add("w-4", "ml-2");
        break;
      default:
        console.warn(`Type de coût inconnu pour ${building.name}`);
        break;
    }


    const buyBttn = document.createElement("button");
    buyBttn.textContent = "ACHETER";
    buyBttn.classList.add("button", "ml-10");

    buildDivChild.appendChild(buildImg);
    buildDivChild.appendChild(buildName);
    buildDivChild.appendChild(buildCost);
if (costIcon) buildDivChild.appendChild(costIcon);
    
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
  if (
    (building.name === "Tour de guet" && watchtower === true) ||
    (building.name === "Moulin" && moulin === true)
  ) {
    alert("batiment unique!");
    return false;
  }

  const argentCost = building.cost.find(c => c.type === "argent");
  const nourritureCost = building.cost.find(c => c.type === "nourriture");

  if (argentCost) {
    if (currentProd > 0 && argentNbr >= argentCost.value) {
      return true;
    } else {
      alert("Tu n'as pas assez d'argent ou la production est nulle.");
      return false;
    }
  }

  if (nourritureCost) {
    if (currentProd > 0 && nourritureNbr >= nourritureCost.value) {
      return true;
    } else {
      alert("Tu n'as pas assez de nourriture ou la production est nulle.");
      return false;
    }
  }
  alert("tu ne peux plus construire ou tu n'as pas assez de ressources!");
  return false;
}

export function placeBuilding(cell: HTMLDivElement, building: Building) {
  const cost = building.cost[0]; 
  if (!cost) {
    console.warn(`Aucun coût défini pour le bâtiment ${building.name}`);
    return;
  }
  switch (cost.type) {
    case "argent":
      updateArgent(-cost.value);
      break;
    case "nourriture":
      updateNourriture(-cost.value);
      break;
    default:
      console.warn(`Type de coût inconnu : ${cost.type}`);
      break;
  }
 
  if (building.name === "Démolition" || building.name === "Bannière") {

    return;
  }
  const buildImg = document.createElement("img");
  buildImg.src = building.sprite;
  buildImg.classList.add("building-placed");

  cell.appendChild(buildImg);
  cell.dataset.building = building.name;
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
        case "currentProd":
            if (cell.getAttribute("owned") == "true") {
            updateCurrentProd(effect.value * 2);
          } else {
            updateCurrentProd(effect.value ?? 0);
          }
          break;  
        default:
          console.log("Aucun effet correspondant");
          break;
      }
    } else if(effect.type == "destroy"){
      destroyBuilding(cell)
    } else if(effect.type == "add"){
      addToFief(cell)
    } else if(effect.type == "invasionName"){
      watchtower = true
      revealName()
    } else if(effect.type == "increaseNourriturePerTurn"){
      if(decreaseNourriturePerTurn){
        changeBooleanState("decreaseNourriturePerTurn")
      }
      moulin = true
      changeBooleanState("increaseNourriturePerTurn")
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
    buildTitle.classList.add("text-2xl", "font-bold", "mt-18");
    buildModalContent.appendChild(buildTitle);

    const buildImg = document.createElement("img");
    buildImg.src = building.sprite;
    buildImg.classList.add("max-2xl:w-12","w-32", "mt-4");
    buildModalContent.appendChild(buildImg);

    const buildText = document.createElement("p");
    buildText.textContent = building.text;
    buildText.classList.add("mt-8", "w-[65%]", "font-semibold");
    buildModalContent.appendChild(buildText);

    const costContainer = document.createElement("div");
    costContainer.classList.add("flex", "flex-row", "items-center", "mt-8");

    const costLabel = document.createElement("p");
    costLabel.textContent = "Coût : ";
    costLabel.classList.add("text-xl", "font-semibold", "mr-2");
    costContainer.appendChild(costLabel);

    building.cost.forEach((cost) => {
      const costDiv = document.createElement("div");
      costDiv.classList.add("flex", "flex-row", "items-center", "mr-4");

      const costValue = document.createElement("p");
      costValue.textContent = `${cost.value > 0 ? "" : ""}${cost.value}`;
      costValue.classList.add(
        "text-3xl", "font-bold",
        cost.type === "argent" ? "text-yellow-600" : "text-green-400"
      );

      const costIcon = document.createElement("img");
      costIcon.src =
        cost.type === "argent" ? "/img/dollar.png" : "/img/apple.png";
      costIcon.classList.add("w-5", "ml-1");

      costDiv.appendChild(costValue);
      costDiv.appendChild(costIcon);
      costContainer.appendChild(costDiv);
    });

    buildModalContent.appendChild(costContainer);

    building.effects.forEach((effect: Effect) => {
      const buildEffect = document.createElement("p");
      buildEffect.textContent = `${effect.modif} : ${(effect.value ?? 0) >= 0 ? "+" : ""}${effect.value}`;
      buildEffect.classList.add("text-xl");
      buildEffectDiv.appendChild(buildEffect);
    });
    buildModalContent.appendChild(buildEffectDiv);
  }
}

function destroyBuilding(cell : HTMLDivElement){
  const cellImg : HTMLImageElement | null = cell.querySelector("img") as HTMLImageElement
  if(cellImg){
    cell.removeChild(cellImg)
    if(cell.dataset.building=="Moulin"){
      changeBooleanState("increaseNourriturePerTurn")
      updateUi();
      moulin = false
    }
    delete cell.dataset.building
  }
}

function addToFief(cell : HTMLDivElement){
  if(!cell.getAttribute("owned")){
    cell.setAttribute("owned", "true");
    cell.classList.add("territory")
  }
}

function revealName(){
  if(invasionNameDisplay?.classList.contains("hidden")){
    invasionNameDisplay.classList.remove("hidden")
  }
  updateInvasionName()
}
