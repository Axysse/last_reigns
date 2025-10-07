const nourritureDisplay: HTMLParagraphElement | null = document.getElementById(
  "nourritureDisplay"
) as HTMLParagraphElement;
const bonheurDisplay: HTMLParagraphElement | null = document.getElementById(
  "bonheurDisplay"
) as HTMLParagraphElement;
const armeeDisplay: HTMLParagraphElement | null = document.getElementById(
  "armeeDisplay"
) as HTMLParagraphElement;
const argentDisplay: HTMLParagraphElement | null = document.getElementById(
  "argentDisplay"
) as HTMLParagraphElement;

let nourritureNbr: number = 5;
let bonheurNbr: number = 10;
let armeeNbr: number = 5;
let argentNbr: number = 15;

export function updateStats() {
  if (nourritureDisplay) {
    nourritureDisplay.innerHTML = "";
    nourritureDisplay.innerHTML = nourritureNbr.toString();
  }
  if (bonheurDisplay) {
    bonheurDisplay.innerHTML = "";
    bonheurDisplay.innerHTML = bonheurNbr.toString();
  }
  if (armeeDisplay) {
    armeeDisplay.innerHTML = "";
    armeeDisplay.innerHTML = armeeNbr.toString();
  }
  if (argentDisplay) {
    argentDisplay.innerHTML = "";
    argentDisplay.innerHTML = argentNbr.toString();
  }
}
