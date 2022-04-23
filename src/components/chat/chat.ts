import Component from '../../core/Component'
import WSMessageDto from '../../dto/WSMessageDto'
import WSMessagesListDto from '../../dto/WSMessagesListDto'

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
      currentUser: GlobalStorage.getInstance().storage.user,
      message: '',
      chatId: props.chatId,
      token: props.token,
      messages: [],
      sendIcon: arrowUpCircle,
      attachmentIcon: attachmentIcon,
      onSubmit: () => {
        const inputMessage = this.retrieveChildByRef("message").getStringValue()
        if (inputMessage) {
          console.log('action/sendMessage', inputMessage);
          this.socket!.send(JSON.stringify({
            content: inputMessage,
            type: 'message',
          }));
          if (this.state.messages.length === 1) {
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

  private serviceMessageTypes = [
    'user connected',
    'pong'
  ]

  componentDidMount(props: ChatProps): void {
    const { chatId, token } = this.state
    const user = GlobalStorage.getInstance().storage.user
    this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${user?.id}/${chatId}/${token}`);
    this.keepWSConnection = true

    this.socket.addEventListener('open', () => {
      console.log('Connected to web socket');
      this.socket!.send(JSON.stringify({
        content: '0',
        type: 'get old',
      }))
      this.startPingingSocket()
    })

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
      const json = JSON.parse(event.data)
      if (this.serviceMessageTypes.includes(json.type)) {
        return
      }

      if (Array.isArray(json)) {
        this.serveWSIncomingMessages(WSMessagesListDto.fromJson(json))
      } else (
        this.serveWSIncomingMessages(new WSMessagesListDto([WSMessageDto.fromJson(json)]))
      )

    });

    this.socket.addEventListener('error', event => {
      console.log('Error', event.message);
    });
  }

  private serveWSIncomingMessages(messagesList: WSMessagesListDto) {
    this.state.messages = messagesList.messages.map(msg => {
      const date = new Date(msg.time)
      return {
        id: msg.id,
        ref: `message-${msg.id}`,
        isMy: msg.userId === this.state.currentUser.id,
        text: msg.content,
        time: `${date.getHours()}:${date.getMinutes()}`
      }
    })
    this.setChildProps('messagesContainer', {
      messages: this.state.messages
    })
  }

  protected componentWillUnmount(): void {
    this.keepWSConnection = false
  }

  private keepWSConnection: boolean = false

  private startPingingSocket(timeout: number = 1000) {
    setTimeout(() => {
      this.socket?.send(JSON.stringify({
        type: 'ping',
      }))
      if (this.keepWSConnection) {
        this.startPingingSocket()
      }
    }, timeout);
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
