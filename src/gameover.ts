import { showModal } from "./ui";

const defeatModal: HTMLDivElement | null = document.getElementById(
  "defeatModal"
) as HTMLDivElement;
const defeatModalContent: HTMLDivElement | null = document.getElementById(
  "defeatModalContent"
) as HTMLDivElement;

interface Text {
  condition: string;
  text: string;
}

interface Defeat {
  id: number;
  type: string;
  img: string;
  text: Text[];
}

let allDefeats: Defeat[] = [];

export async function fetchDefeats() {
  try {
    const response = await fetch("./json/defeat.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Données JSON brutes chargées :", data);
    if (data && data.defeat && Array.isArray(data.defeat)) {
      allDefeats = data.defeat;
      console.log(allDefeats);
    } else {
      console.error(
        "Le format JSON n'est pas celui attendu ou 'allDefeats' n'est pas un tableau."
      );
      allDefeats = [];
    }
  } catch (error) {
    console.error("Erreur de chargement des défaites :", error);
    allDefeats = [];
  }
}

export function defeat(typeDefeat: string, Nbr: number) {
  if (defeatModal) {
    showModal("defeatModal");
  }
  if (defeatModalContent) {
    defeatModalContent.innerHTML = "";
  }
  const defeatTitle = document.createElement("h2");
  defeatTitle.innerText = "Défaite";
  defeatTitle.classList.add("text-2xl", "font-extrabold");
  defeatModalContent?.appendChild(defeatTitle);

  allDefeats.forEach((defeat) => {
    if (defeat.type == typeDefeat) {
      const defeatImg = document.createElement("img");
      defeatImg.src = defeat.img;
      defeatImg.classList.add("mt-10",
    "w-[50%]",
    "h-[45%]",
    "border-6",
    "border-[#4c3219]");
      defeatModalContent?.appendChild(defeatImg);

      const defeatText = document.createElement("p");
      if (Nbr <= 0) {
        defeatText.innerText = defeat.text[1].text;
      } else if (Nbr >= 1) {
        defeatText.innerText = defeat.text[0].text;
      }
      defeatText.classList.add("mt-6" ,"px-4", "w-[50%]");
      defeatModalContent?.appendChild(defeatText);
    }
  });
  setTimeout(() => {
    window.location.reload();
  }, 9000);
}
