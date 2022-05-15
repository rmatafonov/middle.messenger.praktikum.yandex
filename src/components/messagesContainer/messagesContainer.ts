import Component from '../../core/Component'
import './messagesContainer.scss'

export class MessagesContainer extends Component<MessagesContainerProps> {
  static componentName: string = 'MessagesContainer'

  constructor(props: MessagesContainerProps) {
    super(props)
  }

  protected getStateFromProps(props: MessagesContainerProps) {
    this.state = {
      messages: props.messages,
    }
  }

  protected render(): string {
    const { messages } = this.state;

    if (messages.length === 0) {
      return /*html*/`
        <div class="messenger-container__chat-container">
          <p>No Messages</p>
        </div>
      `
    } else {
      return /*html*/`
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
  }
}
