import Component from '../../core/Component'
import { ChatsListItemDto } from '../../dto'

import './chatsList.scss'

export class ChatsList extends Component<ChatsListProps> {
  constructor(props: ChatsListProps) {
    super(props)
  }

  protected getStateFromProps(props: ChatsListProps) {
    this.state = {
      selectChat: (e: Event) => {
        const chatsListItem = e.currentTarget
        const chatRefName = Object.keys(this.refs).find(k => this.refs[k] === chatsListItem)
        if (!chatRefName) {
          return
        }

        this.state.chats.forEach((c: ChatsListItemDto) => {
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
    const { chats, foundChats, foundUsers } = this.props

    if (foundChats || foundUsers) {
      // language=hbs
      return /*html*/`
        <div class="messenger-nav__chats-list">
            {{#each foundChats}}
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

            {{#each foundUsers}}
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
    } else {
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
}
