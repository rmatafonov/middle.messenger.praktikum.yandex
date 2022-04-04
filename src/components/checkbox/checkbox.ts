import Component from '../../core/Component';

import './checkbox.scss';

type CheckboxProps = {
  id?: string;
  label?: string;
  className?: string;
  checked?: string;
}

export class Checkbox extends Component<CheckboxProps> {
  constructor({ id, label, className, checked }: CheckboxProps) {
    super({ id, label, className, checked });
  }

  getBooleanValue = () => (this.element!.querySelector('input') as HTMLInputElement).checked

  protected render(): string {
    // language=hbs
    return /*html*/`
      <div class="{{className}}">
        <input id="{{id}}" type="checkbox" name="{{id}}" class="control" {{#if checked}}checked{{/if}} />
        <label for="{{id}}" class="label-for-control">{{label}}</label>
      </div>
    `;
  }
}
