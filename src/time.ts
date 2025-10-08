import { updateStats } from './stats';
import { callEvent } from './events';
import { refreshBuildings } from './buildings';
import { resetProd } from './stats';

const timeBttn : HTMLButtonElement | null = document.getElementById(
  "timeBttn"
) as HTMLButtonElement;
let turnNbr : HTMLSpanElement | null = document.getElementById("turnNbr") as HTMLSpanElement;

export const invasionDisplay: HTMLParagraphElement | null = document.getElementById(
  "invasionDisplay"
) as HTMLParagraphElement;
let invasionNbr : HTMLSpanElement | null = document.getElementById("invasionNbr") as HTMLSpanElement;


let turn : number = 0
let invasionTurn : number = 10
export let canEndTurn : boolean = false

export function changeTurnPermission(){
    if(canEndTurn == true){
        canEndTurn = false
    } else {
        canEndTurn = true
    }
}

function addTurn(){
    if(turnNbr){
        turnNbr.innerHTML = ''
        turn ++
        turnNbr.innerHTML = turn.toString()
    }
}

if(timeBttn){
    timeBttn.addEventListener("click", () => {
        if (canEndTurn == true) { 
        addTurn()
        callEvent()
        resetProd()
        updateStats()
        changeTurnPermission()
        refreshBuildings()
        console.log(canEndTurn)
        }
    })
}

if(invasionDisplay){
    invasionNbr.innerHTML = invasionTurn.toString()
}