import Component from '../../core/Component'

import arrowUpCircle from '../../img/arrowUpCircle.svg'
import attachmentIcon from '../../img/attachmentIcon.svg'
import './chat.scss'

export class Chat extends Component<MessengerProps> {
  constructor(props: MessengerProps) {
    super(props)
  }

  protected getStateFromProps(props: MessengerProps) {
    this.state = {
      message: '',
      messages: props.messages
    }
  }

  protected render(): string {
    const { message, messages } = this.state;

    if (!messages) {
      return /*html*/`
        <div class="messenger-container__chat-container">
          <p>Select a Chat</p>
        </div>
      `
    }

    let messagesRender: string

    if (messages.length === 0) {
      messagesRender = /*html*/`
        <div class="messenger-container__chat-container">
          <p>No Messages</p>
        </div>
      `
    } else {
      messagesRender = /*html*/`
        <div class="chat-container__messages-container">
            {{#each messages}}
            {{{ MessageBox
                    ref=this.ref
                    isMy=this.isMy
                    text=this.text
                    time=this.time
            }}}
            {{/each}}
        </div>
      `
    }

    // language=hbs
    return /*html*/`
      <div class="messenger-container__chat-container">
        ${messagesRender}
        <div class="chat-container__controls-container">
            <div class="controls-container__icon-container">
                <img src=${attachmentIcon} alt="attach"/>
            </div>
            <div class="controls-container__input-box">
                {{{ Input
                        value="${message}"
                        ref="message"
                        type="text"
                        id="message"
                        className="input-box__disappearing-label"
                        label="Message"
                        autocomplete="off"
                        required="false"
                }}}
            </div>
            <div class="controls-container__icon-container">
                <img src=${arrowUpCircle} alt="send"/>
            </div>
        </div>
      </div>
    `
  }
}
