import Component from '../../core/Component'
import { ChatsListItemDto } from '../../dto'

import './chatsList.scss'

type ChatsListState = {
  values: {}
}
export class ChatsList extends Component<ChatsListProps> {
  constructor(props: ChatsListProps) {
    super(props)
  }

  protected getStateFromProps(props: ChatsListProps) {
    this.state = {
      values: {
        chats: props.chats,
        foundChats: props.foundChats,
        foundUsers: props.foundUsers,
        scrollTop: 0,
      },
      selectUser: (e: Event) => {
        const chatsListItem = e.currentTarget
        const chatRefName = Object.keys(this.refs).find(k => this.refs[k] === chatsListItem)
        if (!chatRefName) {
          return
        }

        const foundUsersWithSelected = this.state.values.foundUsers
          .map((c: ChatsListItemDto) => {
            if (c.ref === chatRefName) {
              c.isSelected = true
            } else {
              c.isSelected = false
            }
            return c
          });

        const nextState = {
          values: {
            ...this.state.values,
            foundUsers: foundUsersWithSelected,
            scrollTop: this.element?.scrollTop
          }
        }
        this.setState(nextState)
        this.props.onUserSelected(chatRefName)
      },
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

  componentDidUpdate(oldProps: ChatsListProps, newProps: ChatsListProps | ChatsListState): boolean {
    if ((newProps as ChatsListState).values) {
      // The state has been chaged
      return true
    }
    // TODO: probably need to compare old with new
    this.state.values.chats = (newProps as ChatsListProps).chats
    this.state.values.foundChats = (newProps as ChatsListProps).foundChats
    this.state.values.foundUsers = (newProps as ChatsListProps).foundUsers
    return true
  }

  componentRendered() {
    if (this.element) {
      this.element.scrollTop = this.state.scrollTop
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
                    headerPrefix=this.headerPrefix
                    header=this.header
                    descriptionPrefix=this.descriptionPrefix
                    description=this.description
                    onClick=@root.selectChat
            }}}
            {{/each}}

            {{#each foundUsers}}
            {{{ ChatsListItem 
                    ref=this.ref
                    isSelected=this.isSelected
                    header=this.fullName
                    description=this.login
                    onClick=@root.selectUser
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
                    headerPrefix=this.headerPrefix
                    header=this.header
                    descriptionPrefix=this.descriptionPrefix
                    description=this.description
                    onClick=@root.selectChat
            }}}
            {{/each}}
        </div>
      `
    }
  }
}
