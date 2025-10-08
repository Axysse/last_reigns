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
    img : string;
    choice : Choice[];
}

const eventModal : HTMLDivElement | null = document.getElementById("eventModal") as HTMLDivElement;
const choice1 : HTMLDivElement | null = document.getElementById("choice1") as HTMLDivElement;
const choice2 : HTMLDivElement | null = document.getElementById("choice2") as HTMLDivElement;
const dialog : HTMLDivElement | null = document.getElementById("dialog") as HTMLDivElement;

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
    console.log("évenement appelé : " + allEvents[getRandomInt(allEvents.length)].name)
    const chosenEvent = allEvents[getRandomInt(allEvents.length)]
    if(eventModal){
        eventModal.style.display = "flex"
        if(dialog){
            setupDialog(chosenEvent)
            setupChoice1(chosenEvent)
            setupChoice2(chosenEvent)
        }
    }
}

function setupDialog(chosenEvent: Event){
    const dialogTitle  = document.createElement("h2")
    dialogTitle.classList.add("font-bold", "mb-4")
    dialogTitle.textContent = chosenEvent.name

    const dialogText = document.createElement("p")
    dialogText.textContent = chosenEvent.text

    const dialogImg = document.createElement("img")
    dialogImg.src = chosenEvent.img
    dialogImg.classList.add("mt-12", "w-[90%]", "h-[60%]")

    if(dialog){
        dialog.appendChild(dialogTitle)
        dialog.appendChild(dialogText)
        dialog.appendChild(dialogImg)
    }
}

function setupChoice1(chosenEvent : Event){
    console.log(chosenEvent.choice[0])

    const choiceText = document.createElement("p")
    choiceText.textContent = chosenEvent.choice[0].text

    if(choice1){
        choice1.appendChild(choiceText)
    }
}

function setupChoice2(chosenEvent: Event){
    console.log(chosenEvent.choice[1])
}