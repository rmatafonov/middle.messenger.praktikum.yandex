import { Component, renderDOM, registerComponent } from './core';
import { capitalizeFirstLetter } from './utils/stringUtils'
import { MessengerPage } from './pages/messenger/messengerPage';
import * as components from './components/*/index.ts'

import './app.scss';

Object.entries(components as { [key: string]: { default: typeof Component } }).forEach(([name, component]) => {
    registerComponent(capitalizeFirstLetter(name), component.default)
});

document.addEventListener("DOMContentLoaded", () => {
    renderDOM(MessengerPage)
});
