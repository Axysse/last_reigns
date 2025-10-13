import "./style.css";
// import { changeTurnPermission } from "./time"
import { fetchEvents  } from "./events";
import { fetchBuildings } from "./buildings";
import { selectedBuilding } from "./buildings";
import { checkBuildCondition } from "./buildings";
import { placeBuilding } from "./buildings";
import { reinitializeSelectedBuilding } from "./buildings";
import { updateCurrentProd, updateStats } from "./stats";
import { checkBiomeCondition } from "./placement";
import { applyBuildingEffetcs } from "./buildings";
import { setStartingStats } from "./stats";
import { addTurn } from "./time";
import { callEvent } from "./events";
import { refreshBuildings } from "./buildings";
import { fetchInvasion, getInvader } from "./invasion";
import { fetchDefeats } from "./gameOver.ts";

let grid: HTMLDivElement | null = document.getElementById(
  "grid"
) as HTMLDivElement;

interface Biome {
  name: string;
  color: string;
  spreadChance: number;
}

// interface BiomeData {
//   biomes: Biome[];
// }

interface FrontierCell {
  x: number;
  y: number;
  biome: Biome;
}

export let allCells: HTMLDivElement[] = [];
let allBiomes: Biome[] = [];
export let newGame: boolean = true;

async function fetchBiomes() {
  try {
    const response = await fetch("./json/biomes.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Données JSON brutes chargées :", data);
    if (data && data.biomes && Array.isArray(data.biomes)) {
      allBiomes = data.biomes;
      console.log(allBiomes);
    } else {
      console.error(
        "Le format JSON n'est pas celui attendu ou 'biomes' n'est pas un tableau."
      );
      allBiomes = [];
    }
  } catch (error) {
    console.error("Erreur de chargement des biomes :", error);
    allBiomes = [];
  }
}

async function createGrid() {
  let columnNbr: number = 10;
  let rowNbr: number = 10;

  let cellIdCounter: number = 0;

  // Initialisation
  let biomeMap = Array.from({ length: rowNbr }, () =>
    Array(columnNbr).fill(null)
  );

  // compteurs de taille biome
  let biomeCounts: Record<string, number> = {};
  allBiomes.forEach((b) => (biomeCounts[b.name] = 0));

  //  Placer des seeds
  let seeds = 10;
  for (let i = 0; i < seeds; i++) {
    let x = getRandomInt(columnNbr);
    let y = getRandomInt(rowNbr);
    let biome = allBiomes[getRandomInt(allBiomes.length)];
    biomeMap[y][x] = biome;
    biomeCounts[biome.name]++;
  }

  //  Propagation des biomes
  const frontier: FrontierCell[] = [];
  biomeMap.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== null) frontier.push({ x, y, biome: cell });
    });
  });

  while (frontier.length > 0) {
    let current = frontier.shift();
    if (!current) continue;
    let { x, y, biome } = current;

    let neighbors = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ];

    neighbors.forEach((n) => {
      if (n.x >= 0 && n.x < columnNbr && n.y >= 0 && n.y < rowNbr) {
        if (biomeMap[n.y][n.x] === null) {
          let biomeRules = biome;
          let chance = biomeRules.spreadChance;

          if (Math.random() < chance) {
            biomeMap[n.y][n.x] = biome;
            biomeCounts[biome.name]++;
            frontier.push({ x: n.x, y: n.y, biome });
          }
        }
      }
    });
  }
  for (let y = 0; y < rowNbr; y++) {
    for (let x = 0; x < columnNbr; x++) {
      let newCell = document.createElement("div");
      newCell.id = cellIdCounter.toString();
      newCell.setAttribute("x", x.toString());
      newCell.setAttribute("y", y.toString());

      let biome = biomeMap[y][x] ?? allBiomes[0];
      newCell.classList.add("cell", biome.color);
      newCell.setAttribute("type", biome.name);

      
        newCell.addEventListener("click", () => {
          if (newGame === true) {
            if(newCell.getAttribute("type") == "eau" || newCell.getAttribute("type") == "montagne" || newCell.getAttribute("type") == "foret"){
              alert("non! pas ici!")
            } else {
              placeCity(newCell);
              setStartingStats(newCell);
              updateStats()
              getInvader()
              refreshBuildings()
              addTurn()
              callEvent()
              // changeTurnPermission()
              newGame = false;
              
            }
          }
          if(!selectedBuilding){
            return;
          } else {
            if(checkBuildCondition(selectedBuilding) == true && checkBiomeCondition(newCell, selectedBuilding )){
              placeBuilding(newCell, selectedBuilding);
              applyBuildingEffetcs(selectedBuilding, newCell )
              reinitializeSelectedBuilding();
              updateCurrentProd(-1)
              updateStats();
            }
          }
        });

        newCell.addEventListener("mouseenter", () => {
        if (selectedBuilding) {
            const previewImg = document.createElement("img");
            previewImg.src = selectedBuilding.sprite;
            previewImg.classList.add("building-preview");
            newCell.appendChild(previewImg);
        }
    });

        newCell.addEventListener("mouseleave", () => {
        const preview = newCell.querySelector(".building-preview");
        if (preview) preview.remove();
    });
      
      if (grid) {
        grid.appendChild(newCell);
      }
      allCells.push(newCell);
      cellIdCounter++;
    }
  }
  console.log("Taille finale des biomes :", biomeCounts);
  console.log(
    `Grille générée avec biomes cohérents : ${columnNbr} x ${rowNbr}`
  );
}

function placeCity(cell: HTMLDivElement) {
  let cityImg: HTMLImageElement = document.createElement("img");
  cityImg.src = "/img/castle.png";
  cell.appendChild(cityImg);
  cell.setAttribute("type", "capitale")
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function getAdjacentCells(cellId: string): (HTMLDivElement | null)[] {
  const casesAdjacentes: (HTMLDivElement | null)[] = [];
  let x: number | null = null;
  let y: number | null = null;

 
  allCells.forEach((cell) => {
    if (cell.id === cellId) {
      x = parseInt(cell.getAttribute("x") || "0", 10);
      y = parseInt(cell.getAttribute("y") || "0", 10);
    }
  });


  if (x === null || y === null) {
    console.warn(`Cellule ${cellId} introuvable`);
    return [];
  }


  const directions = [
    { dx: 0, dy: -1 },  // haut
    { dx: 1, dy: -1 },  // haut-droite
    { dx: -1, dy: -1 }, // haut-gauche
    { dx: 1, dy: 0 },   // droite
    { dx: -1, dy: 0 },  // gauche
    { dx: 0, dy: 1 },   // bas
    { dx: 1, dy: 1 },   // bas-droite
    { dx: -1, dy: 1 }   // bas-gauche
  ];

  
  directions.forEach(({ dx, dy }) => {
    const newX = x! + dx;
    const newY = y! + dy;

 
    if (newX < 0 || newX > 10 || newY < 0 || newY > 10) {
      casesAdjacentes.push(null);
      return;
    }

    const adjacentCell = allCells.find(
      (cell) =>
        parseInt(cell.getAttribute("x") || "-1", 10) === newX &&
        parseInt(cell.getAttribute("y") || "-1", 10) === newY
    );

    casesAdjacentes.push(adjacentCell || null);
  });
  casesAdjacentes.forEach((cell) => {
    if (cell) { 
      cell.setAttribute("owned", "true"); 
    }
  });
  return casesAdjacentes;
}

export function showModal(id: string): void {
  const m = document.getElementById(id) as HTMLElement | null;
  if (!m) return;

  m.style.display = 'flex'; // rend visible
  m.offsetHeight;           // FORCE le reflow → la transition va se déclencher
  m.classList.add('is-open'); 
}

export function hideModal(id: string): void {
  const m = document.getElementById(id) as HTMLElement | null;
  if (!m) return; 

  m.classList.remove('is-open');

  const onTransitionEnd = (): void => {
    m.style.display = 'none';
    m.removeEventListener('transitionend', onTransitionEnd);
  };

  m.addEventListener('transitionend', onTransitionEnd, { once: true });
}


document.addEventListener("DOMContentLoaded", async () => {
  await fetchBiomes();
  await fetchEvents();
  await fetchBuildings();
  await fetchInvasion();
  await fetchDefeats();
  createGrid();
});
