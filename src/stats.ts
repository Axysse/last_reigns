import { getAdjacentCells } from "./main";
import { defeat } from "./gameover";
import { updateUi } from "./ui";

const nourritureDisplay: HTMLParagraphElement | null = document.getElementById(
  "nourritureDisplay"
) as HTMLParagraphElement;
const bonheurDisplay: HTMLParagraphElement | null = document.getElementById(
  "bonheurDisplay"
) as HTMLParagraphElement;
const armeeDisplay: HTMLParagraphElement | null = document.getElementById(
  "armeeDisplay"
) as HTMLParagraphElement;
const argentDisplay: HTMLParagraphElement | null = document.getElementById(
  "argentDisplay"
) as HTMLParagraphElement;
const productionDisplay: HTMLParagraphElement | null = document.getElementById(
  "productionDisplay"
) as HTMLParagraphElement;
const maxProductionDisplay: HTMLParagraphElement | null =
  document.getElementById("maxProductionDisplay") as HTMLParagraphElement;

let statMaxLimit: number = 20;
let statMinLimit: number = 0;

export let nourritureNbr: number = 0;
export let bonheurNbr: number = 0;
export let armeeNbr: number = 0;
export let argentNbr: number = 0;
let maxProd: number = 0;
export let currentProd: number = maxProd;

export let increaseNourriturePerTurn : boolean = false;
export let increaseBonheurPerTurn : boolean = false;
export let increaseArmeePerTurn : boolean = false;
export let increaseArgentPerTurn : boolean = false;

export let decreaseNourriturePerTurn : boolean = false;
export let decreaseBonheurPerTurn : boolean = false;
export let decreaseArmeePerTurn : boolean = false;
export let decreaseArgentPerTurn : boolean = false;

export function updateStats() {
  if (nourritureDisplay) {
    nourritureDisplay.innerHTML = "";
    nourritureDisplay.innerHTML = nourritureNbr.toString();
  }
  if (bonheurDisplay) {
    bonheurDisplay.innerHTML = "";
    bonheurDisplay.innerHTML = bonheurNbr.toString();
  }
  if (armeeDisplay) {
    armeeDisplay.innerHTML = "";
    armeeDisplay.innerHTML = armeeNbr.toString();
  }
  if (argentDisplay) {
    argentDisplay.innerHTML = "";
    argentDisplay.innerHTML = argentNbr.toString();
  }
  if (productionDisplay) {
    // currentProd = maxProd
    productionDisplay.innerHTML = "";
    productionDisplay.innerHTML = currentProd.toString();
  }
  if (maxProductionDisplay) {
    maxProductionDisplay.innerHTML = "";
    maxProductionDisplay.innerHTML = maxProd.toString();
  }
}

export function updateNourriture(value: number) {
  nourritureNbr += value;
}

export function updateBonheur(value: number) {
  bonheurNbr += value;
}

export function updateArmee(value: number) {
  armeeNbr += value;
}

export function updateArgent(value: number) {
  argentNbr += value;
}

export function updateProdMax(value: number) {
  maxProd += value;
}

export function updateCurrentProd(value: number) {
  currentProd += value;
}

export function resetProd() {
  currentProd = maxProd;
}

export function changeInitialValue(variable: string, value: number) {
  switch (variable.toString()) {
    case "nourriture":
      nourritureNbr = value;
      break;
    case "armee":
      armeeNbr = value;
      break;
    case "argent":
      argentNbr = value;
      break;
    case "bonheur":
      bonheurNbr = value;
      break;
    case "production":
      maxProd = value;
      break;      
  }
}

export function setStartingStats(cell: HTMLDivElement) {
  console.log(getAdjacentCells(cell.id));
  const adjacentCells: (HTMLDivElement | null)[] = getAdjacentCells(cell.id);
  adjacentCells.forEach((adj) => {
    const cellType: string = adj?.getAttribute("type")?.toString()!;
    switch (cellType) {
      case "plaine":
        updateNourriture(1);
        break;
      case "montagne":
        updateArmee(1);
        break;
      case "desert":
        updateArgent(1);
        break;
      case "eau":
        updateNourriture(1);
        break;
      case "foret":
        updateBonheur(1);
        break;
      default:
        break;
    }
    adj?.classList.add("territory");
  });
}

export function checkDefeatConditions() {
  if (nourritureNbr <= statMinLimit || nourritureNbr >= statMaxLimit) {
    defeat("nourriture", nourritureNbr);
    return false;
  } else if (bonheurNbr <= statMinLimit || bonheurNbr >= statMaxLimit) {
    defeat("bonheur", bonheurNbr);
    return false;
  } else if (armeeNbr <= statMinLimit || armeeNbr >= statMaxLimit) {
    defeat("armee", armeeNbr);
    return false;
  } else if (argentNbr <= statMinLimit || argentNbr >= statMaxLimit) {
    defeat("argent", argentNbr);
    return false;
  } else {
    return true;
  }
}

export function checkIncreasePerTurn(){
  if(increaseNourriturePerTurn){
    updateNourriture(1)
  } 
  if(increaseBonheurPerTurn){
    updateBonheur(1)
  }
  if(increaseArmeePerTurn){
    updateArmee(1)
  }
  if(increaseArgentPerTurn){
    updateArgent(1)
  }
}

  export function checkDecreasePerTurn(){
  if(decreaseNourriturePerTurn){
    updateNourriture(-1)
  } 
  if(decreaseBonheurPerTurn){
    updateBonheur(-1)
  }
  if(decreaseArmeePerTurn){
    updateArmee(-1)
  }
  if(decreaseArgentPerTurn){
    updateArgent(-1)
  }
}

export function changeBooleanState(variableName : string){
switch(variableName){
  case "increaseNourriturePerTurn":
    increaseNourriturePerTurn = !increaseNourriturePerTurn;
    break;
  case "decreaseNourriturePerTurn":
      decreaseNourriturePerTurn = !decreaseNourriturePerTurn;
      break;
  case "increaseBonheurPerTurn":
    increaseBonheurPerTurn = !increaseBonheurPerTurn;
    break;
  case "decreaseBonheurPerTurn":
      decreaseBonheurPerTurn = !decreaseBonheurPerTurn;
      break;   
  case "increaseArmeePerTurn":
    increaseArmeePerTurn = !increaseArmeePerTurn;
    break;
  case "decreaseArmeePerTurn":
      decreaseArmeePerTurn = !decreaseArmeePerTurn;
      break;
  case "increaseArgentPerTurn":
    increaseArgentPerTurn = !increaseArgentPerTurn;
    break;
  case "decreaseArgentPerTurn":
      decreaseArgentPerTurn = !decreaseArgentPerTurn;
      break;               
  default:
      console.warn(`Boolean variable ${variableName} not found.`);
      break;    
}
updateUi();
}

export const stats = {
  get nourriture() {
    return nourritureNbr;
  },
  get bonheur() {
    return bonheurNbr;
  },
  get armee() {
    return armeeNbr;
  },
  get argent() {
    return argentNbr;
  },
};