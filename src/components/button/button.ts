import Component from '../../core/Component';

import './button.scss';

export class Button extends Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super(props);
  }

  init() {
    this.events = {}
    if (this.props.onClick) {
      this.events.click = this.props.onClick
    }
  }

  protected render(): string {
    let {image} = this.props
 
    // language=hbs
    return /*html*/`
      <div class="{{className}}">
        {{#if text}}
        <button class="control">{{text}}</button>
        {{else}}
        <img src=${image}/>
        {{/if}}
      </div>
    `;
  }
}
