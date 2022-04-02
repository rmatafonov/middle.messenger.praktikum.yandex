import Component from './Component';

export default function renderDOM(ComponentPage: typeof Component) {
  const page = new ComponentPage();

  const root = document.querySelector('#app');
  
  root!.innerHTML = '';
  root!.appendChild(page.getContent());
}
