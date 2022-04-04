import Component from '../../core/Component';

import './button.scss';

type ButtonProps = {
  text?: string;
  className?: string;
  onClick?: () => void;
}

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
    // language=hbs
    return /*html*/`
      <div class="{{className}}">
        <button class="control">{{text}}</button>
      </div>
    `;
  }
}
