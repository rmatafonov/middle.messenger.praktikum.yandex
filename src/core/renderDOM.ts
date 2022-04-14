import Component from './Component';

export default function renderDOM(componentPage: Component) {
  const root = document.querySelector('#app');
  root!.appendChild(componentPage.getContent());
}
