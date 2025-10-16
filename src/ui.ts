import { increaseNourriturePerTurn, decreaseNourriturePerTurn, increaseBonheurPerTurn, decreaseBonheurPerTurn, increaseArmeePerTurn, decreaseArmeePerTurn, increaseArgentPerTurn, decreaseArgentPerTurn} from "./stats";

const nourritureArrowUp : HTMLImageElement | null = document.getElementById("nourritureArrowUp") as HTMLImageElement
const nourritureArrowDown : HTMLImageElement | null = document.getElementById("nourritureArrowDown") as HTMLImageElement

const bonheurArrowUp : HTMLImageElement | null = document.getElementById("bonheurArrowUp") as HTMLImageElement
const bonheurArrowDown : HTMLImageElement | null = document.getElementById("bonheurArrowDown") as HTMLImageElement

const armeeArrowUp : HTMLImageElement | null = document.getElementById("armeeArrowUp") as HTMLImageElement
const armeeArrowDown : HTMLImageElement | null = document.getElementById("armeeArrowDown") as HTMLImageElement

const argentArrowUp : HTMLImageElement | null = document.getElementById("argentArrowUp") as HTMLImageElement
const argentArrowDown : HTMLImageElement | null = document.getElementById("argentArrowDown") as HTMLImageElement

export function showModal(id: string): void {
  const m = document.getElementById(id) as HTMLElement | null;
  if (!m) return;

  m.style.display = 'flex'; 
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


export function updateUi(){
  console.log(increaseNourriturePerTurn)

  if(increaseNourriturePerTurn){
    if(nourritureArrowUp?.classList.contains("hidden")){
      nourritureArrowUp?.classList.remove("hidden")
    }
  } else if(!increaseNourriturePerTurn){
        if(!nourritureArrowUp?.classList.contains("hidden")){
      nourritureArrowUp?.classList.add("hidden")
    }
  }
  
    if(decreaseNourriturePerTurn){
    if(nourritureArrowDown?.classList.contains("hidden")){
      nourritureArrowDown?.classList.remove("hidden")
    }
  } else if(!decreaseNourriturePerTurn){
        if(!nourritureArrowDown?.classList.contains("hidden")){
      nourritureArrowDown?.classList.add("hidden")
    }
  }

    if(increaseBonheurPerTurn){
    if(bonheurArrowUp?.classList.contains("hidden")){
      bonheurArrowUp?.classList.remove("hidden")
    }
  }else if(!increaseBonheurPerTurn){
        if(!bonheurArrowUp?.classList.contains("hidden")){
      bonheurArrowUp?.classList.add("hidden")
    }
  }

  
    if(decreaseBonheurPerTurn){
    if(bonheurArrowDown?.classList.contains("hidden")){
      bonheurArrowDown?.classList.remove("hidden")
    }
  }else if(!decreaseBonheurPerTurn){
        if(!bonheurArrowDown?.classList.contains("hidden")){
      bonheurArrowDown?.classList.add("hidden")
    }
  }

    if(increaseArmeePerTurn){
    if(armeeArrowUp?.classList.contains("hidden")){
      armeeArrowUp?.classList.remove("hidden")
    }
  }else if(!increaseArmeePerTurn){
        if(!armeeArrowUp?.classList.contains("hidden")){
      armeeArrowUp?.classList.add("hidden")
    }
  }


    if(decreaseArmeePerTurn){
    if(armeeArrowDown?.classList.contains("hidden")){
      armeeArrowDown?.classList.remove("hidden")
    }
  }else if(!decreaseArmeePerTurn){
        if(!armeeArrowDown?.classList.contains("hidden")){
      armeeArrowDown?.classList.add("hidden")
    }
  }

    if(increaseArgentPerTurn){
    if(argentArrowUp?.classList.contains("hidden")){
      argentArrowUp?.classList.remove("hidden")
    }
  }else if(!increaseArgentPerTurn){
        if(!argentArrowUp?.classList.contains("hidden")){
      argentArrowUp?.classList.add("hidden")
    }
  }


    if(decreaseArgentPerTurn){
    if(argentArrowDown?.classList.contains("hidden")){
      argentArrowDown?.classList.remove("hidden")
    }
  }else if(!decreaseArgentPerTurn){
        if(!argentArrowDown?.classList.contains("hidden")){
      argentArrowDown?.classList.add("hidden")
    }
  }
}