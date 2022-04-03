import EventBus from './EventBus'
import { nanoid } from 'nanoid'
import Handlebars from 'handlebars'

interface BlockMeta<P = any> {
  props: P;
}

type Events = Values<typeof Component.EVENTS>;

export default abstract class Component<P extends {} = {}> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  public id = nanoid(6);
  private readonly _meta: BlockMeta;

  protected _element: Nullable<HTMLElement> = null;
  protected readonly props: P;
  protected events?: Record<string, (...arg: any[]) => void>;
  protected children: { [id: string]: Component<P> } = {};

  eventBus: () => EventBus<Events>;

  protected state: any = {};
  protected refs: { [key: string]: HTMLElement } = {};

  public constructor(props?: P) {
    const eventBus = new EventBus<Events>();

    this._meta = {
      props,
    };

    this.getStateFromProps(props)

    this.props = this._makePropsProxy(props || {} as P);
    this.state = this._makePropsProxy(this.state);

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);

    eventBus.emit(Component.EVENTS.INIT, this.props);
  }

  private _registerEvents(eventBus: EventBus<Events>) {
    eventBus.on(Component.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    this._element = this._createDocumentElement('div');
  }

  protected getStateFromProps(props: any): void {
    this.state = {};
  }

  private _init() {
    this.init()
    this._createResources()
    this.eventBus().emit(Component.EVENTS.FLOW_RENDER, this.props)
  }

  init() { }

  private _componentDidMount(props: P) {
    this.componentDidMount(props);
  }

  componentDidMount(props: P) {
  }

  private _componentDidUpdate(oldProps: P, newProps: P) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  componentDidUpdate(oldProps: P, newProps: P) {
    return true;
  }

  setProps = (nextProps: P) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  setChildProps = (childRefName: string, nextProps: P) => {
    if (!nextProps || !childRefName) {
      return;
    }

    const childComponent = this.retrieveChildByRef(childRefName)
    childComponent.setProps(nextProps)
    this.refs[childRefName] = childComponent.getContent()
  }

  retrieveChildByRef = (ref: string) => {
    const childBlocks = Object.values(this.children).filter(c => c.element === this.refs[ref])
    if (childBlocks.length !== 1) {
      console.warn(`1 Ref with Name ${ref} is expected but was: ${childBlocks}`)
    }
    return childBlocks[0]
  }

  setState = (nextState: any) => {
    if (!nextState) {
      return;
    }

    Object.assign(this.state, nextState);
  };

  get element() {
    return this._element;
  }

  private _render() {
    const fragment = this._compile();

    this._removeEvents();
    const newElement = fragment.firstElementChild!;

    this._element!.replaceWith(newElement);

    this._element = newElement as HTMLElement;
    this._addEvents();
  }

  protected abstract render(): string

  getContent(): HTMLElement {
    // Хак, чтобы вызвать CDM только после добавления в DOM
    if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      setTimeout(() => {
        if (this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
          this.eventBus().emit(Component.EVENTS.FLOW_CDM);
        }
      }, 100)
    }

    return this.element!;
  }

  private _makePropsProxy(props: any): any {
    // Можно и так передать this
    // Такой способ больше не применяется с приходом ES6+
    const self = this;

    return new Proxy(props as unknown as object, {
      get(target: Record<string, unknown>, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: Record<string, unknown>, prop: string, value: unknown) {
        target[prop] = value;

        // Запускаем обновление компоненты
        // Плохой cloneDeep, в след итерации нужно заставлять добавлять cloneDeep им самим
        self.eventBus().emit(Component.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    }) as unknown as P;
  }

  private _createDocumentElement(tagName: string) {
    return document.createElement(tagName);
  }

  private _removeEvents() {
    if (!this.events || !this._element) {
      return;
    }


    Object.entries(this.events).forEach(([event, listener]) => {
      this._element!.removeEventListener(event, listener);
    });
  }

  private _addEvents() {
    if (!this.events) {
      return;
    }

    Object.entries(this.events).forEach(([event, listener]) => {
      this._element!.addEventListener(event, listener);
    });
  }

  _compile(): DocumentFragment {
    const fragment = document.createElement('template');

    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template({ ...this.state, ...this.props, children: this.children, refs: this.refs });

    Object.entries(this.children).forEach(([id, component]) => {
      const stub = fragment.content.querySelector(`[data-id="${id}"]`);

      if (!stub) {
        return;
      }

      stub.replaceWith(component.getContent());
    });


    return fragment.content;
  }


  show() {
    this.getContent().style.display = 'block';
  }

  hide() {
    this.getContent().style.display = 'none';
  }
}
