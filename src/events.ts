import { getRandomInt } from "./main";

interface Effect {
    type: string;
    modif?: string;
    value?: number;
    target?: string;
}
interface Choice {
    text: string;
    effects: Effect[];
}
interface Event{
    id : number;
    name : string;
    text : string;
    choice : Choice[];
}

let allEvents: Event[] = [];

export async function fetchEvents() {
  try {
    const response = await fetch("./json/events.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Données JSON brutes chargées :", data);
    if (data && data.events && Array.isArray(data.events)) {
      allEvents = data.events;
      console.log(allEvents);
    } else {
      console.error(
        "Le format JSON n'est pas celui attendu ou 'allEvents' n'est pas un tableau."
      );
      allEvents = [];
    }
  } catch (error) {
    console.error("Erreur de chargement des évenements :", error);
    allEvents = [];
  }
}

export function callEvent(){
    console.log("evenement appelé : " + allEvents[getRandomInt(allEvents.length)].name)
}