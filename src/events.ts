import { getRandomInt } from "./main";
import {
  checkDefeatConditions,
  increaseArmeePerTurn,
  increaseNourriturePerTurn,
  updateNourriture,
} from "./stats";
import { updateBonheur } from "./stats";
import { updateArmee } from "./stats";
import { updateArgent } from "./stats";
import { updateStats } from "./stats";
import { changeTurnPermission, updateinvasion } from "./time";
import { canEndTurn } from "./time";
import { invasionDisplay } from "./time";
import { showModal } from "./ui";
import { hideModal } from "./ui";
import { changeBooleanState } from "./stats";

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
interface Event {
  id: number;
  name: string;
  text: string;
  img: string;
  choice: Choice[];
}

const eventModal: HTMLDivElement | null = document.getElementById(
  "eventModal"
) as HTMLDivElement;
let choice1: HTMLDivElement | null = document.getElementById(
  "choice1"
) as HTMLDivElement;
let choice2: HTMLDivElement | null = document.getElementById(
  "choice2"
) as HTMLDivElement;
const dialog: HTMLDivElement | null = document.getElementById(
  "dialog"
) as HTMLDivElement;

let allEvents: Event[] = [];
let cleanEvents: Event[] = [];

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

export function callEvent() {
  if (allEvents.length === 0) {
    console.log("Tous les événements ont été joués !");
    return;
  }

  const randomIndex = getRandomInt(allEvents.length);
  const chosenEvent = allEvents[randomIndex];

  console.log("Événement appelé :", chosenEvent.name);

  if (eventModal) {
    showModal("eventModal");
    if (dialog) {
      setupDialog(chosenEvent);
      setupChoice1(chosenEvent);
      setupChoice2(chosenEvent);
    }
  }
}

function setupDialog(chosenEvent: Event) {
  if (dialog) {
    dialog.innerHTML = " ";
  }

  const textDiv = document.createElement("div");
  textDiv.classList.add(
    "h-[40%]",
    "flex",
    "flex-col",
    "gap-4",
    "items-center",
    "justify-center"
  );

  const dialogTitle = document.createElement("h2");
  dialogTitle.classList.add("font-bold", "mb-2", "text-white");
  dialogTitle.textContent = chosenEvent.name;

  const dialogText = document.createElement("p");
  dialogText.classList.add("text-white");
  dialogText.textContent = chosenEvent.text;

  const dialogImg = document.createElement("img");
  dialogImg.src = chosenEvent.img;
  dialogImg.classList.add(
    "mt-10",
    "w-[75%]",
    "max-xl:h-[45%]",
    "h-[60%]",
    "border-6",
    "border-[#4c3219]"
  );

  if (dialog) {
    dialog.appendChild(dialogTitle);
    dialog.appendChild(textDiv);
    textDiv.appendChild(dialogText);
    dialog.appendChild(dialogImg);
  }
}

function setupChoice1(chosenEvent: Event) {
  console.log(chosenEvent.choice[0]);
  if (!choice1) return;

  choice1.innerHTML = "";
  const newChoice1 = choice1.cloneNode(false) as HTMLDivElement;
  choice1.parentNode?.replaceChild(newChoice1, choice1);

  newChoice1.innerHTML = "";

  const choiceText = document.createElement("p");
  choiceText.classList.add(
    "h-[15%]",
    "w-[75%]",
    "mt-16",
    "text-xl",
    "font-semibold",
    "px-8",
    "text-center"
  );
  choiceText.textContent = chosenEvent.choice[0].text;

  const effectsDiv = document.createElement("div");
  effectsDiv.classList.add("mt-8", "h-[45%]");

  const suppText = document.createElement("p");
  suppText.classList.add(
    "h-[10%]",
    "w-[65%]",
    "font-semibold",
    "text-xl",
    "px-10"
  );
  suppText.innerHTML = " ";

  const allEffects = document.createElement("div");
  allEffects.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-[80%]"
  );
  chosenEvent.choice[0].effects.forEach((effect: Effect) => {
    console.log(effect);
    if (effect.type == "stats" && effect.modif) {
      const effectDiv = document.createElement("div");
      effectDiv.classList.add("flex", "flex-row", "items-center", "gap-8");
      const effectImg = document.createElement("img");
      effectImg.src = returnStatImg(effect.modif);
      effectImg.classList.add("w-12");
      const effectDisplay = document.createElement("p");
      effectDisplay.classList.add("font-semibold", "text-xl");
      effectDisplay.innerHTML = `${effect.modif} ${
        (effect.value ?? 0) >= 0 ? "+" : ""
      }${effect.value}`;

      effectDiv.appendChild(effectImg);
      effectDiv.appendChild(effectDisplay);
      allEffects.appendChild(effectDiv);
    }
    effectsDiv.appendChild(allEffects);
    if (effect.type == "activate" && effect.target == "invasionDisplay") {
      suppText.innerHTML = "Tour de l'attaque connu.";
    } else if (
      effect.type == "activate" &&
      effect.target == "invasionNbrRecul"
    ) {
      suppText.innerHTML = "Tour de l'attaque reculé.";
    } else if (
      effect.type == "activate" &&
      effect.target == "increaseBonheurPerTurn"
    ) {
      suppText.innerHTML = "+ 1 Bonheur par tour";
    } else if (
      effect.type == "activate" &&
      effect.target == "increaseArmeePerTurn"
    ) {
      suppText.innerHTML = "+ 1 Armée par tour";
    } else if (
      effect.type == "activate" &&
      effect.target == "increaseArgentPerTurn"
    ) {
      suppText.innerHTML = "+ 1 Argent par tour";
    } else if (
      effect.type == "activate" &&
      effect.target == "decreaseNourriturePerTurn"
    ) {
      suppText.innerHTML = "- 1 Nourriture par tour";
    } else if (
      effect.type == "activate" &&
      effect.target == "decreaseArmeePerTurn"
    ) {
      suppText.innerHTML = "- 1 Armée par tour";
    }
  });

  newChoice1.appendChild(choiceText);
  newChoice1.appendChild(effectsDiv);
  newChoice1.appendChild(suppText);

  choice1 = newChoice1;

  newChoice1.addEventListener("click", () => {
    resolveEvent(chosenEvent.choice[0].effects, chosenEvent);
  });
}

function setupChoice2(chosenEvent: Event) {
  console.log(chosenEvent.choice[1]);
  if (!choice2) return;

  choice2.innerHTML = "";
  const newChoice2 = choice2.cloneNode(false) as HTMLDivElement;
  choice2.parentNode?.replaceChild(newChoice2, choice2);

  newChoice2.innerHTML = "";

  const choiceText = document.createElement("p");
  choiceText.classList.add(
    "h-[15%]",
    "w-[75%]",
    "mt-16",
    "text-xl",
    "font-semibold",
    "px-8",
    "text-center"
  );
  choiceText.textContent = chosenEvent.choice[1].text;

  const effectsDiv = document.createElement("div");
  effectsDiv.classList.add("mt-8", "h-[45%]");

  const suppText = document.createElement("p");
  suppText.classList.add(
    "h-[10%]",
    "w-[65%]",
    "font-semibold",
    "text-xl",
    "px-10"
  );
  suppText.innerHTML = " ";

  const allEffects = document.createElement("div");
  allEffects.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-[80%]"
  );
  chosenEvent.choice[1].effects.forEach((effect: Effect) => {
    console.log(effect);
    if (effect.type == "stats" && effect.modif) {
      const effectDiv = document.createElement("div");
      effectDiv.classList.add("flex", "flex-row", "items-center", "gap-8");
      const effectImg = document.createElement("img");
      effectImg.src = returnStatImg(effect.modif);
      effectImg.classList.add("w-12");
      const effectDisplay = document.createElement("p");
      effectDisplay.classList.add("font-semibold", "text-xl");
      effectDisplay.innerHTML = `${effect.modif} ${
        (effect.value ?? 0) >= 0 ? "+" : ""
      }${effect.value}`;

      effectDiv.appendChild(effectImg);
      effectDiv.appendChild(effectDisplay);
      allEffects.appendChild(effectDiv);
    }
    effectsDiv.appendChild(allEffects);
    if (effect.type == "activate" && effect.target == "invasionDisplay") {
      suppText.innerHTML = "Tour de l'attaque connu.";
    } else if (
      effect.type == "activate" &&
      effect.target == "invasionNbrRecul"
    ) {
      suppText.innerHTML = "Tour de l'attaque reculé.";
    } else if (
      effect.type == "activate" &&
      effect.target == "increaseBonheurPerTurn"
    ) {
      suppText.innerHTML = "+ 1 Bonheur par tour";
    } else if (
      effect.type == "activate" &&
      effect.target == "increaseArmeePerTurn"
    ) {
      suppText.innerHTML = "+ 1 Armée par tour";
    } else if (
      effect.type == "activate" &&
      effect.target == "increaseArgentPerTurn"
    ) {
      suppText.innerHTML = "+ 1 Argent par tour";
    } else if (
      effect.type == "activate" &&
      effect.target == "decreaseNourriturePerTurn"
    ) {
      suppText.innerHTML = "- 1 Nourriture par tour";
    } else if (
      effect.type == "activate" &&
      effect.target == "decreaseArmeePerTurn"
    ) {
      suppText.innerHTML = "- 1 Armée par tour";
    }
  });

  newChoice2.appendChild(choiceText);
  newChoice2.appendChild(effectsDiv);
  newChoice2.appendChild(suppText);

  choice2 = newChoice2;

  newChoice2.addEventListener("click", () => {
    console.log("coucou");
    resolveEvent(chosenEvent.choice[1].effects, chosenEvent);
  });
  (window as any).choice2 = newChoice2;
}

export function returnStatImg(modif: string): string {
  switch (modif) {
    case "nourriture":
      return "/img/apple.png";
    case "bonheur":
      return "/img/happy.png";
    case "armee":
      return "/img/sword.png";
    case "argent":
      return "/img/dollar.png";
    case "production":
      return "/img/hammer.png";
    default:
      return "img/ecaireur.jpg";
  }
}

function resolveEvent(effects: Effect[], chosenEvent?: Event) {
  effects.forEach((effect) => {
    switch (effect.type) {
      case "stats":
        switch (effect.modif) {
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
            console.log("rien");
            break;
        }
        break;
      case "activate":
        if (effect.target == "invasionDisplay") {
          invasionDisplay?.classList.remove("hidden");
        } else if (effect.target == "invasionNbrRecul") {
          updateinvasion(1);
        } else if (effect.target == "invasionNbrAvance") {
          updateinvasion(-1);
        } else if (effect.target == "increaseBonheurPerTurn") {
          changeBooleanState("increaseBonheurPerTurn");
        } else if (effect.target == "increaseArmeePerTurn") {
          changeBooleanState("increaseArmeePerTurn");
        } else if (effect.target == "increaseArgentPerTurn") {
          changeBooleanState("increaseArgentPerTurn");
        } else if (effect.target == "decreaseNourriturePerTurn") {
          if (increaseNourriturePerTurn) {
            changeBooleanState("increaseNourriturePerTurn");
          }
          changeBooleanState("decreaseNourriturePerTurn");
        } else if (effect.target == "decreaseArmeePerTurn") {
          if (increaseArmeePerTurn) {
            changeBooleanState("increaseArmeePerTurn");
          }
          changeBooleanState("decreaseArmeePerTurn");
        }
        break;
      default:
        console.log("encore plus tard");
        break;
    }
  });
  if (chosenEvent) {
    moveEventToClean(chosenEvent);
  }
  updateStats();
  if (eventModal) {
    hideModal("eventModal");
  }
  checkDefeatConditions();
  changeTurnPermission();
  console.log(canEndTurn);
}

function moveEventToClean(chosenEvent: Event) {
  allEvents = allEvents.filter((event) => event.id !== chosenEvent.id);
  if (!cleanEvents.some((event) => event.id === chosenEvent.id)) {
    cleanEvents.push(chosenEvent);
  }
}

export function refreshEvents() {
  const excludedIds = [15, 16, 17, 18];
  let eventsToAdd;

  if (excludedIds.length > 0) {
    eventsToAdd = cleanEvents.filter(
      (event) => !excludedIds.includes(event.id)
    );
  } else {
    eventsToAdd = cleanEvents;
  }
  allEvents = allEvents.concat(eventsToAdd);
  cleanEvents = [];

  console.log("Événements réinitialisés :", allEvents);
  console.log("Événements exclus (par ID) :", excludedIds);
}
