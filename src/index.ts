import { Block, renderDOM, registerComponent } from './core';
import { SignInPage } from './pages/signIn/signIn';

import './app.scss';

const components = require('./components/**/index.ts') as { [key: string]: { default: typeof Block } };

Object.values(components).forEach((component) => {
    registerComponent(component.default);
});

document.addEventListener("DOMContentLoaded", () => {
    renderDOM(SignInPage);
});
