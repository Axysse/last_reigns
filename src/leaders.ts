import { changeInitialValue } from "./stats";
import { showModal, hideModal } from "./ui";
import { returnStatImg } from "./events";
import { updateStats } from "./stats";

const leaderModal : HTMLDivElement | null = document.getElementById("leaderModal") as HTMLDivElement;
const portrait : HTMLDivElement | null = document.getElementById("portrait") as HTMLDivElement;

interface Stats {
    type: string;
    value: number;
}

interface Leaders {
    id : number;
    img : string;
    name: string;
    text: string;
    stats : Stats[];
}

let allLeaders: Leaders[] = [];

export async function fetchLeaders() {
  try {
    const response = await fetch("./json/leaders.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Données JSON brutes chargées :", data);
    if (data && data.leaders && Array.isArray(data.leaders)) {
      allLeaders= data.leaders;
      console.log(allLeaders);
    } else {
      console.error(
        "Le format JSON n'est pas celui attendu ou 'allLeaders' n'est pas un tableau."
      );
      allLeaders = [];
    }
  } catch (error) {
    console.error("Erreur de chargement des évenements :", error);
    allLeaders = [];
  }
}

export function chooseLeader(){
    if(leaderModal){
        showModal("leaderModal")
        leaderModal.innerHTML = ""
    }
    allLeaders.forEach(leader => {
        const newLeaderDiv = document.createElement("div")
        newLeaderDiv.classList.add("flex", "flex-col", "items-center", "bg-[url(/img/parchemin-bg.png)]", "bg-cover", "bg-center", "w-[35%]", "h-[80%]", "text-black", "px-6", "choice", "overflow-hidden")

        const newLeaderName = document.createElement("h2")
        newLeaderName.classList.add("text-2xl", "font-bold", "mt-24")
        newLeaderName.textContent = leader.name
        newLeaderDiv.appendChild(newLeaderName)

        const newLeaderImg = document.createElement("img")
        newLeaderImg.src = leader.img
        newLeaderImg.classList.add("h-[25%]", "mt-4", "border-6", "border-[#4c3219]")
        newLeaderDiv.appendChild(newLeaderImg)

        const newLeaderText = document.createElement("p")
        newLeaderText.classList.add("text-xl", "text-center", "mt-4", "w-[75%]")
        newLeaderText.textContent = leader.text
        newLeaderDiv.appendChild(newLeaderText)

        const newLeaderStatsDiv = document.createElement("div")
        newLeaderStatsDiv.classList.add("flex", "flex-col", "items-center", "mt-4", "h-[35%]")
        newLeaderDiv.appendChild(newLeaderStatsDiv)

        leader.stats.forEach(stat => {
            const newStatDiv = document.createElement("div")
            newStatDiv.classList.add("flex", "flex-row", "items-center", "justify-center", "gap-2",)

            const newStatImg = document.createElement("img")
            newStatImg.src = returnStatImg(stat.type);
            newStatImg.classList.add("w-6", "2xl:w-12")
            newStatDiv.appendChild(newStatImg)

            const newStatName = document.createElement("p")
            newStatName.innerText = stat.type;
            newStatDiv.appendChild(newStatName)

            const newStatValue = document.createElement("p")
            newStatValue.innerText = stat.value.toString()
            newStatDiv.appendChild(newStatValue)

            newLeaderStatsDiv.appendChild(newStatDiv)
        });
        leaderModal?.appendChild(newLeaderDiv)

        newLeaderDiv.addEventListener("click", () => {
            leader.stats.forEach(stat => {
                changeInitialValue(stat.type, stat.value)
            });
            updateStats()
            if(portrait){
              const leaderImg = document.createElement("img")
              leaderImg.src = leader.img
              leaderImg.classList.add("w-24")
              portrait.appendChild(leaderImg)
            }
            hideModal("leaderModal")
        })
    });

}