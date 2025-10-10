import { turn, invasionTurn } from "./time";
import { loop } from "./time";
import { showModal, hideModal } from "./main";

interface Stats {
  modif: string;
  value: number;
}
interface Text {
  condition: string;
  value: string;
}
interface Invasion {
  id: number;
  name: string;
  img: string;
  difficulty: number;
  stats: Stats[];
  text: Text[];
}

const invasionModal: HTMLDivElement | null = document.getElementById(
  "invasionModal"
) as HTMLDivElement;
const invasionModalContent: HTMLDivElement | null = document.getElementById(
  "invasionModalContent"
) as HTMLDivElement;

let allInvasion: Invasion[] = [];
export let currentInvasion: Invasion;

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

export function checkInvasionTrigger() {
  if (turn == invasionTurn) return true;
}

export function getInvader() {
  allInvasion.forEach((invasion) => {
    if (invasion.difficulty == loop) {
      currentInvasion = invasion;
      console.log("invasion choisie : " + invasion.name);
    }
  });
}

export function callInvasionEvent(invasion: Invasion) {
  if (invasionModal) {
    showModal("invasionModal");
  }
  if (invasionModalContent) {
    const invasionName = document.createElement("p");
    invasionName.textContent = invasion.name;
    invasionName.classList.add("text-xl", "font-bold");
    invasionModalContent.appendChild(invasionName);

    const invasionText = document.createElement("p");
    invasionText.textContent = invasion.text[0].value;
    invasionText.classList.add("mt-6")
    invasionModalContent.appendChild(invasionText);

    const invasionImg = document.createElement("img");
    invasionImg.src = invasion.img;
    invasionImg.classList.add("mt-8", "w-[90%]", "h-[60%]");
    invasionModalContent.appendChild(invasionImg)

    const nextBttn = document.createElement("button");
    nextBttn.textContent = "SUIVANT"
    nextBttn.classList.add("button", "mt-12", "text-white")
    invasionModalContent.appendChild(nextBttn)

    nextBttn.addEventListener("click", () => {
        console.group("rien")
    })

    // to be continued
  }
}
