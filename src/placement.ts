import type { Building } from "./buildings";
import { checkBuildCondition } from "./buildings";



export function checkBiomeCondition(cell: HTMLDivElement, building: Building): boolean {
    if (cell.dataset.building) {
        alert("Cette case est déjà occupée !");
        return false;
    }
    const biome = cell.getAttribute("type");
    if (building.condition !== "any" && biome !== building.condition) {
        alert(`Ce bâtiment ne peut être construit que sur un biome de type ${building.condition} !`);
        return false;
    }
    if (!checkBuildCondition(building)) {
        return false;
    }
    return true;
}
