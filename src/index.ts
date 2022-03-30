import { Block, renderDOM, registerComponent } from './core';
import { SignInPage } from './pages/signIn/signIn';
import * as components from './components/*/index.ts'

import './app.scss';

// const components = require('./components/**/index.ts') as { [key: string]: { default: typeof Block } };

Object.values(components as { [key: string]: { default: typeof Block } }).forEach((component) => {
    registerComponent(component.default);
});

document.addEventListener("DOMContentLoaded", () => {
    renderDOM(SignInPage);
});
