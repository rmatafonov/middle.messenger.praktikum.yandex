import Component from '../../core/Component'

import arrowUpCircle from '../../img/arrowUpCircle.svg'
import attachmentIcon from '../../img/attachmentIcon.svg'
import GlobalStorage from '../../service/front/GlobalStorage'
import './chat.scss'

export class Chat extends Component<ChatProps> {
  private socket?: WebSocket

  constructor(props: ChatProps) {
    super(props)
  }

  protected getStateFromProps(props: ChatProps) {
    this.state = {
      message: '',
      chatId: props.chatId,
      token: props.token,
      messages: [],
      sendIcon: arrowUpCircle,
      attachmentIcon: attachmentIcon,
      onSubmit: () => {
        const inputMessage = this.retrieveChildByRef("message").getStringValue()

        const nextState = {
          message: ''
        };

        this.setState(nextState);

        if (inputMessage) {
          console.log('action/sendMessage', inputMessage);
          this.socket!.send(JSON.stringify({
            content: inputMessage,
            type: 'message',
          }));
          this.state.messages.push(inputMessage)
          this.setState({message: ''})
          if (this.state.messages.length === 1) {
            this.props.onFirstMessageSent()
          }
        }
      },
      onAttach: () => {
        console.log('action/attach');
      }
    }
  }

  componentDidMount(props: ChatProps): void {
    const { chatId, token } = this.state
    const user = GlobalStorage.getInstance().storage.user
    this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${user?.id}/${chatId}/${token}`);

    this.socket.addEventListener('open', () => {
      console.log('Connected to web socket');
    });

    this.socket.addEventListener('close', event => {
      if (event.wasClean) {
        console.log('Closed connection');
      } else {
        console.log('Connection interrupted');
      }

      console.log(`Code: ${event.code} | Reason: ${event.reason}`);
    });

    this.socket.addEventListener('message', event => {
      console.log('Receved data', event.data);
    });

    this.socket.addEventListener('error', event => {
      console.log('Error', event.message);
    });
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
            {{{ Button
                  className="controls-container__icon-container" 
                  image=attachmentIcon
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
                  image=sendIcon
                  onClick=onSubmit
            }}}
        </div>
      </div>
    `
  }
}
