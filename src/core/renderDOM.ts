import Component from './Component';

export default function renderDOM(componentPage: Component) {
  const root = document.querySelector('#app');
  if (root) {
    root.innerHTML = ''
    root.appendChild(componentPage.getContent());
  } else {
    throw Error('No HTML DOM Element with id #app')
  }
}
