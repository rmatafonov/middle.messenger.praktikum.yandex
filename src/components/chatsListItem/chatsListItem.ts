import Component from '../../core/Component'

import './chatsListItem.scss'
import defaultAvatar from '../../img/camera_200.png'

export class ChatsListItem extends Component<ChatsListItemProps> {
  constructor(props: ChatsListItemProps) {
    super(props)
  }

  init(): void {
    this.events = { 
      click: this.props.onClick 
    }
  }

  protected render(): string {
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
                    {{!-- TODO: add Handlebars helper for truncating a text to X symbols (here is 140) --}}
                </span>
            </div>
        </div>
        <hr>
      </div>
    `
  }
}
