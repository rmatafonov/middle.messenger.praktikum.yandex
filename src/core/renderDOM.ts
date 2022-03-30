import Component from './Component';

export default function renderDOM(ComponentPage: typeof Component) {
  const block = new ComponentPage();

  const root = document.querySelector('#app');
  
  root!.innerHTML = '';
  root!.appendChild(block.getContent());
}
