import Block from '../../core/Block';

import './input.scss';

interface InputProps {
  id?: string;
  type?: 'text' | 'password' | 'email';
  className?: string;
  autocomplete: boolean;
  required: boolean;
  label?: string;
  value?: string;
  onChange?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export class Input extends Block {
  constructor({ id, type, className, autocomplete, required, label, value, onChange = () => { }, onFocus = () => { }, onBlur = () => { } }: InputProps) {
    super({ id, type, className, autocomplete, required, label, value, events: { input: onChange, focusin: onFocus, focusout: onBlur } });
  }

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
