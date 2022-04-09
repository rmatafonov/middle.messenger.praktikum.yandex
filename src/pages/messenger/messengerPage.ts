import { Component } from '../../core';

import './css/messenger.scss'
import chatsList from './chatsNoSelected.json'
import messagesList from './messages.json'
import defaultAvatar from '../../img/camera_200.png'
import arrowUpCircle from '../../img/arrowUpCircle.svg'
import attachmentIcon from '../../img/attachmentIcon.svg'

export class MessengerPage extends Component {
    protected getStateFromProps() {
        this.state = {
            values: {
                account: {
                    firstName: 'Vasily',
                    secondName: 'Ivanov',
                },
                search: '',
                message: '',
                isAnyChatSelected: false,
                chatsListScrollTop: 0,
                chats: (chatsList as ChatsList).map((chatListItem: ChatsListItemProps, i: number) => {
                    chatListItem.ref = `chat-${i}`
                    chatListItem.isSelected = false
                    return chatListItem
                }),
                messages: (messagesList as MessagesList).map((message: MessageBoxProps, i: number) => {
                    message.ref = `message-${i}`
                    return message
                })
            },
            selectChat: () => {
                let chatsList = this.refs["chatsList"]

                const nextState = {
                    values: {
                        ...this.state.values,
                        isAnyChatSelected: true,
                        chatsListScrollTop: chatsList.scrollTop
                    }
                }
                this.setState(nextState)
            },
        }
    }

    componentRendered() {
        let chatsList = this.refs["chatsList"]
        if (chatsList) {
            chatsList.scrollTop = this.state.values.chatsListScrollTop
        }
    }

    protected render(): string {
        const { values } = this.state;

        return /*html*/`
            <div class="messenger-page">
                <div class="messenger-container">
                    <nav class="messenger-container__nav">
                        <div class="nav__header">
                            <div class="chats-container__profie-container">
                                <div class="chats-container__profie-photo">
                                    <img src="${defaultAvatar}" alt="Ph">
                                </div>
                                <div class="chats-container__profie-name">${values.account.firstName} ${values.account.secondName} (me)</div>
                            </div>
                            <hr>
                            <div class="chats-container__search-box">
                                {{{ Input
                                        value="${values.search}"
                                        ref="search"
                                        type="text" 
                                        id="search" 
                                        className="input-box__disappearing-label search-input-box" 
                                        label="Search" 
                                        autocomplete="off"
                                        required="false"
                                }}}
                            </div>
                            <hr>
                        </div>
                        <div class="messenger-nav__chats-list-container">
                            {{{ ChatsList
                                    ref="chatsList"
                                    chats=values.chats
                                    onChatSelected=selectChat
                            }}}
                        </div>
                    </nav>

                    <div class="messenger-container__chat-container">
                        {{#if values.isAnyChatSelected}}
                        <div class="chat-container__messages-container">
                            {{#each values.messages}}
                            {{{ MessageBox 
                                    ref=this.ref
                                    isMy=this.isMy
                                    text=this.text
                                    time=this.time
                            }}}
                            {{/each}}
                        </div>
                        <div class="chat-container__controls-container">
                            <div class="controls-container__icon-container">
                                <img src=${attachmentIcon} alt="attach"/>
                            </div>
                            <div class="controls-container__input-box">
                                {{{ Input
                                        value="${values.message}"
                                        ref="message"
                                        type="text"
                                        id="message"
                                        className="input-box__disappearing-label"
                                        label="Message"
                                        autocomplete="off"
                                        required="false"
                                }}}
                            </div>
                            <div class="controls-container__icon-container">
                                <img src=${arrowUpCircle} alt="send"/>
                            </div>
                        </div>
                        {{else}}
                        <p>Select a Chat</p>
                        {{/if}}
                    </div>
                </div>
            </div>
        `
    }
}
