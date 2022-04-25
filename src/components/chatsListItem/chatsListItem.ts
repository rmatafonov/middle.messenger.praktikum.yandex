import Component from '../../core/Component'

import './chatsListItem.scss'
import defaultAvatar from '../../img/camera_200.png'
import { chatsAPI } from '../../service/back'
import GlobalStorage from '../../service/front/GlobalStorage'

export class ChatsListItem extends Component<ChatsListItemProps> {
  static MAX_DESCRIPTION_LEN = 140

  constructor(props: ChatsListItemProps) {
    super(props)
  }

  protected getStateFromProps(props: ChatsListItemProps): void {
    this.state = {
      id: props.chat ? props.chat.id : props.user?.id,
      headerPrefix: '',
      header: props.chat? props.chat.title : props.user?.displayName,
      descriptionPrefix: '',
      description: props.chat? props.chat.lastMessage?.content : props.user?.login,
      isLoading: props.chat ? true : false
    }
  }

  componentDidMount(props: ChatsListItemProps): void {
    if (!this.props.chat) {
      // This is found user item
      return
    }

    chatsAPI.getChatUsers(this.state.id)
      .then(usersDto => {
        const currentUser = GlobalStorage.getInstance().storage.user
        let newHeader = this.state.header
        if (usersDto.users.length <= 2) {
          const companion = usersDto.users.filter(u => u.id !== currentUser!.id)[0]
          newHeader = companion.displayName
        }

        const lastMessage = this.props.chat?.lastMessage
        if (!lastMessage) {
          const nextState = {
            header: newHeader,
            isLoading: false
          }
          this.setState(nextState)
          return
        }

        let descriptionPrefix = ''
        if (lastMessage.user.login === currentUser?.login) {
          descriptionPrefix = 'You'
        }
        let description = lastMessage.content
        if (description.length > ChatsListItem.MAX_DESCRIPTION_LEN) {
          description = description.slice(0, ChatsListItem.MAX_DESCRIPTION_LEN) + '...'
        }

        const nextState = {
          header: newHeader,
          descriptionPrefix: descriptionPrefix,
          description: description,
          isLoading: false
        }
        this.setState(nextState)
      })
  }

  init(): void {
    this.events = { 
      click: this.props.onClick 
    }
  }

  protected render(): string {
    if (this.state.isLoading) {
      return /*html*/ `
        <div>
          <div class="chats-list__item-container">
              Loading...
          </div>
          <hr>
        </div>
      `
    }
    // language=hbs
    return /*html*/`
      <div>
        <div class="chats-list__item-container {{#if isSelected}}chats-list__item-container-selected{{/if}}">
            <div class="chats-list-container__sender-photo">
                <img class="photo-image" src="${defaultAvatar}" alt="Ph">
            </div>
            <div class="chats-list-container__last-message-container">
                <span>
                    {{#if headerPrefix}}
                    <span class="bold-text">{{headerPrefix}}:</span>
                    {{/if}} {{header}}
                </span>
                <span class="mini-text">
                    {{#if descriptionPrefix}}
                    <span class="bold-text">{{descriptionPrefix}}:</span>
                    {{/if}} {{description}}
                </span>
            </div>
        </div>
        <hr>
      </div>
    `
  }
}
