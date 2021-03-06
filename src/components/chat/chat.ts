import Component from '../../core/Component'
import WSMessagesListDto from '../../dto/WSMessagesListDto'

import arrowUpCircle from '../../img/arrowUpCircle.svg'
import attachmentIcon from '../../img/attachmentIcon.svg'
import WebSocketTransport from '../../service/back/WebSocketTransport'
import GlobalStorage from '../../service/front/GlobalStorage'
import './chat.scss'

export class Chat extends Component<ChatProps> {
  static componentName: string = 'Chat';
  private wsTransport?: WebSocketTransport

  constructor(props: ChatProps) {
    super(props)
  }

  protected getStateFromProps(props: ChatProps) {
    this.state = {
      currentUser: GlobalStorage.getInstance().storage.user,
      message: '',
      chatId: props.chatId,
      token: props.token,
      messages: [],
      onSubmit: () => {
        const inputMessage = this.retrieveChildByRef("message").getStringValue()
        if (inputMessage) {
          console.log('action/sendMessage', inputMessage);
          this.wsTransport?.send(inputMessage)
          if (this.state.messages.length === 1 && this.props.onFirstMessageSent) {
            this.props.onFirstMessageSent()
          }

          this.setState({ message: '' });
        }
      },
      onAttach: () => {
        console.log('action/attach');
      }
    }
  }

  componentDidMount(_props: ChatProps): void {
    const { chatId, token } = this.state
    this.wsTransport = new WebSocketTransport(chatId, token)
    this.wsTransport.eventBus.on(WebSocketTransport.EVENTS.WS_MESSAGES_ARRIVED, this.serveWSIncomingMessages.bind(this))
    this.wsTransport.start()
  }

  private serveWSIncomingMessages(messagesList: WSMessagesListDto) {
    const arrivedMessages = messagesList.messages.map(msg => {
      const date = new Date(msg.time)
      return {
        id: msg.id,
        ref: `message-${msg.id}`,
        isMy: msg.userId === this.state.currentUser.id,
        text: msg.content,
        time: `${date.getHours()}:${date.getMinutes()}`
      }
    })

    this.state.messages = this.state.messages.concat(arrivedMessages)
    this.setChildProps('messagesContainer', {
      messages: this.state.messages
    })
  }

  protected componentWillUnmount(): void {
    this.wsTransport?.stop()
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

    // language=hbs
    return /*html*/`
      <div class="messenger-container__chat-container">
        {{{ MessagesContainer
              ref="messagesContainer" 
              messages=messages
        }}}
        <div class="chat-container__controls-container">
            {{{ Button
                  className="controls-container__icon-container" 
                  image="${attachmentIcon}"
                  onClick=onAttach
            }}}
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
            {{{ Button
                  className="controls-container__icon-container" 
                  image="${arrowUpCircle}"
                  onClick=onSubmit
            }}}
        </div>
      </div>
    `
  }
}
