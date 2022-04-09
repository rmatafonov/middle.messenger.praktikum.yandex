import Component from '../../core/Component'

import './chatsList.scss'

export class ChatsList extends Component<ChatsListProps> {
  constructor(props: ChatsListProps) {
    super(props)
  }

  protected getStateFromProps(props: any) {
    this.state = {
      chats: props.chats,
      selectChat: (e: Event) => {
        const chatsListItem = e.currentTarget
        const chatRefName = Object.keys(this.refs).find(k => this.refs[k] === chatsListItem)
        if (!chatRefName) {
          return
        }

        this.state.chats.forEach((c: ChatsListItemProps) => {
          if (c.ref === chatRefName) {
            c.isSelected = true
          } else {
            c.isSelected = false
          }
        });

        this.props.onChatSelected()
      },
    }
  }

  protected render(): string {
    const { chats } = this.state;

    // language=hbs
    return /*html*/`
      <div class="messenger-nav__chats-list">
          {{#each chats}}
          {{{ ChatsListItem 
                  ref=this.ref
                  isSelected=this.isSelected
                  lastMessageHeaderPrefix=this.lastMessageHeaderPrefix
                  lastMessageHeader=this.lastMessageHeader
                  lastMessageSender=this.lastMessageSender
                  lastMessageText=this.lastMessageText
                  onClick=@root.selectChat
          }}}
          {{/each}}
      </div>
    `
  }
}
