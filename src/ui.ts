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
