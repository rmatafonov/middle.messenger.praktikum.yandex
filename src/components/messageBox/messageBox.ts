import Component from '../../core/Component'

import './messageBox.scss'

export interface MessageBoxProps {
    ref?: string
    isMy: boolean
    text: string
    time: string
}

export class MessageBox extends Component {
    constructor(props: MessageBoxProps) {
        super(props)
    }

    protected render(): string {
        // language=hbs
        return /*html*/`
      <div class="messages-container__message messages-container__message-{{#if isMy}}my{{else}}other{{/if}}">
          <div>
              {{text}}
          </div>
          <div class="message-container__time mini-text">
              {{time}}
          </div>
      </div>
    `
    }
}
