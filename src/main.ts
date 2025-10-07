import "./style.css";
import { changeTurnPermission } from "./time"

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

let allCells: HTMLDivElement[] = [];
let allBiomes: Biome[] = [];
let newGame: boolean = true;

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
  let columnNbr: number = 15;
  let rowNbr: number = 15;

  let cellIdCounter: number = 0;

  // Initialisation
  let biomeMap = Array.from({ length: rowNbr }, () =>
    Array(columnNbr).fill(null)
  );

  // compteurs de taille biome
  let biomeCounts: Record<string, number> = {};
  allBiomes.forEach((b) => (biomeCounts[b.name] = 0));

  //  Placer des seeds
  let seeds = 12;
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
              newGame = false;
              changeTurnPermission()
            }
          }
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
  cityImg.src = "../public/img/castle.png";
  cell.appendChild(cityImg);
  cell.setAttribute("type", "capitale")
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchBiomes();
  createGrid();
});
