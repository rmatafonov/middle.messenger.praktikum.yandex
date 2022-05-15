import Component from '../../core/Component';

import './input.scss';

type InputProps = {
  id?: string;
  type?: 'text' | 'password' | 'email';
  className?: string;
  autocomplete?: boolean;
  required?: boolean;
  label?: string;
  value?: string;
  onChange?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export class Input extends Component<InputProps> {
  static componentName: string = 'Input'

  constructor(props: InputProps) {
    super(props);
  }

  init() {
    this.events = {}
    if (this.props.onChange) {
      this.events.input = this.props.onChange
    }
    if (this.props.onFocus) {
      this.events.focusin = this.props.onFocus
    }
    if (this.props.onBlur) {
      this.events.focusout = this.props.onBlur
    }
  }

  getStringValue = () => (this.element!.querySelector('input') as HTMLInputElement).value

  protected render(): string {
    // language=hbs
    return /*html*/`
      <div class="{{className}}">
          <div class="input-container">
            <input id="{{id}}" type="{{type}}" name="{{id}}" value="{{value}}" class="control" {{#if autocomplete}}autocomplete="{{autocomplete}}"{{/if}} {{#if required}}required="{{required}}"{{else}}required{{/if}} />
            <label for="{{id}}" class="label-for-control">{{label}}</label>
          </div>
      </div>
    `
  }
}
