import {
  turn,
  invasionTurn,
  updateinvasion,
  updateLoop,
  addTurn,
  updateInvasionName,
} from "./time";
import { loop } from "./time";
import { hideModal, showModal } from "./ui";
import { argentNbr, armeeNbr, bonheurNbr, nourritureNbr } from "./stats";
import { invasionDisplay } from "./time";
import { defeat } from "./gameover";
import { getRandomInt, getRandomIntBetween } from "./main";
import { refreshEvents } from "./events";
import { callEvent } from "./events";
import { resetProd } from "./stats";
import { updateStats } from "./stats";
import { refreshBuildings } from "./buildings";
import { changeTurnPermission } from "./time";
import { stats } from "./stats";
import { finalVictory } from "./victory";

interface Stats {
  modif: string;
  value: number;
}
interface Text {
  condition: string;
  value: string;
  modif: string;
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
  let possibleInvasion: Invasion[] = [];
  allInvasion.forEach((invasion) => {
    if (invasion.difficulty == loop) {
      possibleInvasion.push(invasion);
    }
  });
  if (possibleInvasion.length > 1) {
    let index = getRandomInt(possibleInvasion.length);
    currentInvasion = possibleInvasion[index];
  } else {
    currentInvasion = possibleInvasion[0];
  }
  console.log("invasion choisie : " + currentInvasion.name);
}

export function callInvasionEvent(invasion: Invasion) {
  if (invasionModalContent) {
    invasionModalContent.innerHTML = "";
  }
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
    invasionText.classList.add("mt-6", "px-6", "w-[50%]");
    invasionModalContent.appendChild(invasionText);

    const invasionImg = document.createElement("img");
    invasionImg.src = invasion.img;
    invasionImg.classList.add(
      "mt-10",
      "w-[50%]",
      "h-[45%]",
      "border-6",
      "border-[#4c3219]"
    );
    invasionModalContent.appendChild(invasionImg);

    const nextBttn = document.createElement("button");
    nextBttn.textContent = "Viens-là mauviette!";
    nextBttn.classList.add("button", "mt-12", "text-white");
    invasionModalContent.appendChild(nextBttn);

    nextBttn.addEventListener("click", () => {
      invasionModalContent.innerHTML = "";

      const invasionName = document.createElement("p");
      invasionName.textContent = invasion.name;
      invasionName.classList.add("text-xl", "font-bold");
      invasionModalContent.appendChild(invasionName);

      const statsDiv = document.createElement("div");
      statsDiv.classList.add(
        "flex",
        "flex-row",
        "items-center",
        "gap-4",
        "justify-center"
      );
      invasionModalContent.appendChild(statsDiv);

      const resolution = document.createElement("p");
      resolution.textContent = "Résolution en cours...";
      resolution.classList.add("text-center", "mt-6", "italic");
      invasionModalContent.appendChild(resolution);

      invasion.stats.forEach((stat) => {
        const statContainer = document.createElement("div");
        statContainer.classList.add(
          "flex",
          "flex-col",
          "items-center",
          "gap-1"
        );

        let iconSrc = "";
        switch (stat.modif) {
          case "armee":
            iconSrc = "img/sword.png";
            break;
          case "argent":
            iconSrc = "img/dollar.png";
            break;
          case "bonheur":
            iconSrc = "img/happy.png";
            break;
          case "nourriture":
            iconSrc = "img/apple.png";
            break;
          default:
            console.log("Cas non prévu :", stat.modif);
            return;
        }

        const playerValue = stats[stat.modif as keyof typeof stats];

        const statImg = document.createElement("img");
        statImg.src = iconSrc;
        statImg.classList.add("w-16", "mb-1");

        const vs = document.createElement("p");
        vs.textContent = `${playerValue} VS ${stat.value}`;
        vs.classList.add("font-semibold", "text-center");

        statContainer.appendChild(statImg);
        statContainer.appendChild(vs);
        statsDiv.appendChild(statContainer);
      });

      setTimeout(() => {
        if (resolveInvasion(invasion.stats)) {
          console.log("victoire");
          victory(invasion);
        } else {
          console.log("défaite");
          lost(invasion);
        }
      }, 6000);
    });
  }
}

function resolveInvasion(stats: Stats[] | null) {
  let victory: boolean = true;
  if (stats) {
    stats.forEach((stat) => {
      switch (stat.modif) {
        case "armee":
          if (stat.value > armeeNbr) {
            victory = false;
          }
          break;
        case "nourriture":
          if (stat.value > nourritureNbr) {
            victory = false;
          }
          break;
        case "bonheur":
          if (stat.value > bonheurNbr) {
            victory = false;
          }
          break;
        case "argent":
          if (stat.value > argentNbr) {
            victory = false;
          }
          break;
        default:
          console.log("cas non prévu");
      }
    });
    return victory;
  }
}

function victory(invasion: Invasion) {
  if (invasionModalContent) {
    invasionModalContent.innerHTML = "";

    const invasionName = document.createElement("p");
    invasionName.textContent = invasion.name;
    invasionName.classList.add("text-xl", "font-bold");
    invasionModalContent.appendChild(invasionName);

    const invasionText = document.createElement("p");
    invasionText.textContent = invasion.text[1].value;
    invasionText.classList.add("mt-6", "px-6", "w-[50%]");
    invasionModalContent.appendChild(invasionText);

    const invasionImg = document.createElement("img");
    invasionImg.src = invasion.img;
    invasionImg.classList.add(
      "mt-10",
      "w-[50%]",
      "h-[45%]",
      "border-6",
      "border-[#4c3219]"
    );
    invasionModalContent.appendChild(invasionImg);

    const nextBttn = document.createElement("button");
    nextBttn.textContent = "Et bon vent!";
    nextBttn.classList.add("button", "mt-12", "text-white");
    invasionModalContent.appendChild(nextBttn);

    nextBttn.addEventListener("click", () => {
      if (loop == 4) {
        hideModal("invasionModal");
        finalVictory();
      } else {
        hideModal("invasionModal");
        if (invasionDisplay) {
          if (!invasionDisplay?.classList.contains("hidden")) {
            invasionDisplay.classList.add("hidden");
          }
        }
        refreshEvents();
        updateinvasion(getRandomIntBetween(8, 12));
        updateLoop(1);
        getInvader();
        updateInvasionName();
        addTurn();
        callEvent();
        resetProd();
        updateStats();
        changeTurnPermission();
        refreshBuildings();
        console.log("boucle de jeu :" + " " + loop);
      }
    });
  }
}

function lost(invasion: Invasion) {
  if (invasionModalContent) {
    invasionModalContent.innerHTML = "";

    const invasionName = document.createElement("p");
    invasionName.textContent = invasion.name;
    invasionName.classList.add("text-xl", "font-bold");
    invasionModalContent.appendChild(invasionName);

    const invasionText = document.createElement("p");
    invasionText.textContent = invasion.text[2].value;
    invasionText.classList.add("mt-6", "px-6", "w-[50%]");
    invasionModalContent.appendChild(invasionText);

    const invasionImg = document.createElement("img");
    invasionImg.src = invasion.img;
    invasionImg.classList.add(
      "mt-10",
      "w-[50%]",
      "h-[45%]",
      "border-6",
      "border-[#4c3219]"
    );
    invasionModalContent.appendChild(invasionImg);

    const nextBttn = document.createElement("button");
    nextBttn.textContent = "La journée avait pourtant si bien commencée...";
    nextBttn.classList.add("button", "mt-12", "text-white");
    invasionModalContent.appendChild(nextBttn);

    nextBttn.addEventListener("click", () => {
      hideModal("invasionModal");
      defeat("invasion", 0);
    });
  }
}
