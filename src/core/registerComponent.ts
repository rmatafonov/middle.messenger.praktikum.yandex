import Component from './Component';
import Handlebars, { HelperOptions } from 'handlebars';

interface ComponentConstructable<Props extends {} = {}> {
  new(props: Props): Component;
}

export default function registerComponent(componentName: string, Component: ComponentConstructable) {
  Handlebars.registerHelper(componentName, function ({ hash: { ref, ...hash }, data }: HelperOptions) {
    if (!data.root.children) {
      data.root.children = {};
    }

    if (!data.root.refs) {
      data.root.refs = {};
    }

    const { children, refs } = data.root;

    const component = new Component(hash);

    children[component.id] = component;

    if (ref) {
      refs[ref] = component.getContent();
    }

    return `<div data-id="${component.id}"></div>`;
  })
}
