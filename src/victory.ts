import { showModal } from "./ui";

const victoryModal: HTMLDivElement | null = document.getElementById(
  "victoryModal"
) as HTMLDivElement;

const victoryModalContent: HTMLDivElement | null = document.getElementById(
  "victoryModalContent"
) as HTMLDivElement;

export function finalVictory() {
  if (victoryModal) {
    showModal("victoryModal");
  }
  if (victoryModalContent) {
    victoryModalContent.innerHTML = "";
  }
  const victoryTitle = document.createElement("h2");
  victoryTitle.innerText = "VICTOIRE";
  victoryTitle.classList.add("text-2xl", "font-extrabold");
  victoryModalContent?.appendChild(victoryTitle);

  const victoryImg = document.createElement("img");
  victoryImg.src = "/img/victory.png";
  victoryImg.classList.add(
    "mt-10",
    "w-[50%]",
    "h-[45%]",
    "border-6",
    "border-[#4c3219]"
  );
  victoryModalContent?.appendChild(victoryImg);

    const victoryText = document.createElement("p");
    victoryText.innerText = "";
    victoryText.classList.add("mt-6" ,"px-4", "w-[50%]");
    victoryModalContent?.appendChild(victoryText);

  setTimeout(() => {
    window.location.reload();
  }, 9000);
}
