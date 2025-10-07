import { updateStats } from './stats'
import { callEvent } from './events';

const timeBttn : HTMLButtonElement | null = document.getElementById(
  "timeBttn"
) as HTMLButtonElement;
let turnNbr : HTMLSpanElement | null = document.getElementById("turnNbr") as HTMLSpanElement;

const invasionDisplay: HTMLParagraphElement | null = document.getElementById(
  "invasionDisplay"
) as HTMLParagraphElement;
let invasionNbr : HTMLSpanElement | null = document.getElementById("invasionNbr") as HTMLSpanElement;


let turn : number = 0
let invasionTurn : number = 10
let canEndTurn : boolean = false

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
        if (canEndTurn) { 
        addTurn()
        callEvent()
        updateStats()
        changeTurnPermission()
        }
    })
}