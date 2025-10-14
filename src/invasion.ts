import { turn, invasionTurn, updateinvasion, updateLoop } from "./time";
import { loop } from "./time";
import { hideModal, showModal } from "./ui";
import { argentNbr, armeeNbr, bonheurNbr, nourritureNbr } from "./stats";
import { invasionDisplay } from "./time";
import { defeat } from "./gameover";

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
    invasionText.classList.add("mt-6");
    invasionModalContent.appendChild(invasionText);

    const invasionImg = document.createElement("img");
    invasionImg.src = invasion.img;
    invasionImg.classList.add("mt-8", "w-[90%]", "h-[60%]");
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

      invasion.stats.forEach((stat) => {
        switch (stat.modif) {
          case "armee":
            const statImg = document.createElement("img");
            statImg.src = "img/sword.png";
            statImg.classList.add("mt-8", "w-24");

            const vs = document.createElement("p");
            vs.textContent =
              armeeNbr.toString() + " " + "VS" + " " + stat.value.toString();

            const resolution = document.createElement("p");
            resolution.textContent = "résolution en cours...";

            invasionModalContent.appendChild(statImg);
            invasionModalContent.appendChild(statsDiv);
            statsDiv.appendChild(vs);
            invasionModalContent.appendChild(resolution);

            setTimeout(() => {
              if (resolveInvasion(invasion.stats)) {
                console.log("victoire");
                victory(invasion);
              } else {
                console.log("défaite");
                lost(invasion);
              }
            }, 2000);
            break;
          default:
            console.log("le cas n'est pas encore prévu");
        }
      });
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
    invasionText.classList.add("mt-6");
    invasionModalContent.appendChild(invasionText);

    const invasionImg = document.createElement("img");
    invasionImg.src = invasion.img;
    invasionImg.classList.add("mt-8", "w-[90%]", "h-[60%]");
    invasionModalContent.appendChild(invasionImg);

    const nextBttn = document.createElement("button");
    nextBttn.textContent = "Et bon vent!";
    nextBttn.classList.add("button", "mt-12", "text-white");
    invasionModalContent.appendChild(nextBttn);

    nextBttn.addEventListener("click", () => {
      hideModal("invasionModal");
      if (invasionDisplay) {
        if (!invasionDisplay?.classList.contains("hidden")) {
          invasionDisplay.classList.add("hidden");
        }
      }
      updateinvasion(10);
      updateLoop(1)
      console.log( "boucle de jeu :" + " " + loop )
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
    invasionText.classList.add("mt-6");
    invasionModalContent.appendChild(invasionText);

    const invasionImg = document.createElement("img");
    invasionImg.src = invasion.img;
    invasionImg.classList.add("mt-8", "w-[90%]", "h-[60%]");
    invasionModalContent.appendChild(invasionImg);

    const nextBttn = document.createElement("button");
    nextBttn.textContent = "La journée avait pourtant si bien commencée...";
    nextBttn.classList.add("button", "mt-12", "text-white");
    invasionModalContent.appendChild(nextBttn);

    nextBttn.addEventListener("click", () => {
      hideModal("invasionModal");
      defeat("invasion", 0)
    });
  }
}
