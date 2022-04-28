import Component from '../../core/Component';

import './label.scss';

interface LabelProps {
  id?: string;
  className?: Array<string>;
  text?: string;
}

export class Label extends Component {
  constructor({ id, className, text }: LabelProps) {
    super({ id, className, text });
  }

  protected render(): string {
      // language=hbs
      return /*html*/`<div id="{{id}}" class="{{className}}">{{text}}</div>`
  }
}
