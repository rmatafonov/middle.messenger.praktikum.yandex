import { Component, renderDOM, registerComponent } from './core';
import { SignUpPage } from './pages/signUp/signUp';
import * as components from './components/*/index.ts'

import './app.scss';

Object.values(components as { [key: string]: { default: typeof Component } }).forEach((component) => {
    registerComponent(component.default);
});

document.addEventListener("DOMContentLoaded", () => {
    renderDOM(SignUpPage);
});
