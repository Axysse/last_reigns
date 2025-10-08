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

 let nourritureNbr: number = 5;
 let bonheurNbr: number = 10;
 let armeeNbr: number = 5;
 let argentNbr: number = 10;
 let maxProd : number = 1
 export let currentProd : number = maxProd

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
  if(productionDisplay){
    // currentProd = maxProd
    productionDisplay.innerHTML = "";
    productionDisplay.innerHTML = currentProd.toString()
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

export function resetProd(){
  currentProd = maxProd
}

