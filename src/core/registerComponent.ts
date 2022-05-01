import Handlebars, { HelperOptions } from 'handlebars';

export default function registerComponent(Component: ComponentConstructable) {
  console.log(`Registering compoentnt with name ${Component.componentName}`)
  Handlebars.registerHelper(Component.componentName, function ({ hash: { ref, ...hash }, data }: HelperOptions) {
    if (!data.root.children) {
      data.root.children = {};
    }

    if (!data.root.refs) {
      data.root.refs = {};
    }

    const { children, refs } = data.root;

    const component = new Component(hash);

    children[component.id] = component;
    component.parentComponent = data.root

    if (ref) {
      component.ref = ref
      refs[ref] = component.getContent();
    }

    return `<div data-id="${component.id}"></div>`;
  })
}
