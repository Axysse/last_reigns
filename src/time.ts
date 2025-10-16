import { checkDecreasePerTurn, checkDefeatConditions, checkIncreasePerTurn, updateStats } from "./stats";
import { callEvent } from "./events";
import { refreshBuildings } from "./buildings";
import { resetProd } from "./stats";
import {
  checkInvasionTrigger,
  callInvasionEvent,
  currentInvasion,
} from "./invasion";


const timeBttn: HTMLButtonElement | null = document.getElementById(
  "timeBttn"
) as HTMLButtonElement;
let turnNbr: HTMLSpanElement | null = document.getElementById(
  "turnNbr"
) as HTMLSpanElement;

export const invasionDisplay: HTMLParagraphElement | null =
  document.getElementById("invasionDisplay") as HTMLParagraphElement;

let invasionNbr: HTMLSpanElement | null = document.getElementById(
  "invasionNbr"
) as HTMLSpanElement;

export const invasionNameDisplay: HTMLParagraphElement | null =
  document.getElementById("invasionName") as HTMLParagraphElement;

  export let invasionNameValue: HTMLSpanElement | null = document.getElementById(
  "invasionNameValue"
) as HTMLSpanElement;  



export let loop: number = 0;
export let turn: number = 0;
export let invasionTurn: number = 10;
export let canEndTurn: boolean = false;

export function changeTurnPermission() {
  if (canEndTurn == true) {
    canEndTurn = false;
  } else {
    canEndTurn = true;
  }
}

export function addTurn() {
  if (turnNbr) {
    turnNbr.innerHTML = "";
    turn++;
    turnNbr.innerHTML = turn.toString();
  }
}

if (timeBttn) {
  timeBttn.addEventListener("click", () => {
    if (canEndTurn == true) {
      checkDefeatConditions();
      if (checkInvasionTrigger()) {
        callInvasionEvent(currentInvasion);
      } else {
        addTurn();
        callEvent();
        resetProd();
        updateStats();
        checkIncreasePerTurn();
        checkDecreasePerTurn();
        changeTurnPermission();
        refreshBuildings();
        updateInvasionName()
        console.log(canEndTurn);
      }
    }
  });
}

if (invasionDisplay) {
  invasionNbr.innerHTML = invasionTurn.toString();
}

export function updateinvasion(value: number) {
  invasionTurn += value;
  if (invasionDisplay && invasionNbr) {
    invasionNbr.innerHTML = invasionTurn.toString();
  }
}

export function updateLoop(value : number){
  loop += value;
}

export function updateInvasionName(){
  if(invasionNameValue){
    invasionNameValue.innerHTML = ''
    invasionNameValue.innerHTML = currentInvasion.name
  }
}
