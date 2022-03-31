import { Component, renderDOM, registerComponent } from './core';
import { SignInPage } from './pages/signIn/signIn';
import * as components from './components/*/index.ts'

import './app.scss';

Object.values(components as { [key: string]: { default: typeof Component } }).forEach((component) => {
    registerComponent(component.default);
});

document.addEventListener("DOMContentLoaded", () => {
    renderDOM(SignInPage);
});
