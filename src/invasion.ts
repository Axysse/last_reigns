import { turn, invasionTurn } from "./time";

interface Stats{
    modif : string;
    value : number
}
interface Text{
    condition : string;
    value : string;
}
interface Invasion {
    id :number;
    name : string;
    difficulty : number,
    stats : Stats[];
    text : Text[];
}

let allInvasion : Invasion[] = []

export async function fetchInvasion() {
  try {
    const response = await fetch("./json/invasion.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Données JSON brutes chargées :", data);
    if (data && data.invasion && Array.isArray(data.invasion)) {
      allInvasion = data.invasion;
      console.log(allInvasion);
    } else {
      console.error(
        "Le format JSON n'est pas celui attendu ou 'allInvasion' n'est pas un tableau."
      );
      allInvasion = [];
    }
  } catch (error) {
    console.error("Erreur de chargement des évenements :", error);
    allInvasion = [];
  }
}


export function checkInvasionTrigger(){
    if(turn == invasionTurn)
        return true
}

export function callInvasionEvent(){

}