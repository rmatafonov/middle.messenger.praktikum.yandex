import Component from '../../core/Component'

import './chatsListItem.scss'
import defaultAvatar from '../../img/camera_200.png'

export interface ChatsListItemProps {
  ref: string
  isSelected: boolean
  lastMessageHeaderPrefix: string
  lastMessageHeader: string
  lastMessageSender: string
  lastMessageText: string
  onClick: (e: Event) => void
}

export class ChatsListItem extends Component {
  constructor({ isSelected, lastMessageHeaderPrefix, lastMessageHeader, lastMessageSender, lastMessageText, onClick }: ChatsListItemProps) {
    super({ isSelected, lastMessageHeaderPrefix, lastMessageHeader, lastMessageSender, lastMessageText, events: { click: onClick } })
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
                    {{#if lastMessageHeaderPrefix}}
                    <span class="bold-text">{{lastMessageHeaderPrefix}}:</span>
                    {{/if}} {{lastMessageHeader}}
                </span>
                <span class="mini-text">
                    {{#if lastMessageSender}}
                    <span class="bold-text">{{lastMessageSender}}:</span>
                    {{/if}} {{lastMessageText}}
                    {{!-- TODO: add Handlebars helper for truncating a text to X symbols (here is 140) --}}
                </span>
            </div>
        </div>
        <hr>
      </div>
    `
  }
}
