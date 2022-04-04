import { Component } from '../../core';
import { ChatsListItemProps } from '../../components/chatsListItem';

import './messenger.scss'
import chatsList from './chatsNoSelected.json'
import defaultAvatar from '../../img/camera_200.png'

(chatsList as Array<ChatsListItemProps>).forEach((chatListItem: ChatsListItemProps, i: number) => {
    chatListItem.ref = `chat-${i}`
    chatListItem.isSelected = false
})

export class MessengerPage extends Component {
    protected getStateFromProps() {
        this.state = {
            values: {
                account: {
                    firstName: 'Vasily',
                    secondName: 'Ivanov',
                },
                search: '',
                isAnyChatSelected: false,
                chats: chatsList,
            },
            selectChat: (e: Event) => {
                const control = e.currentTarget
                const chatRefName = Object.keys(this.refs).find(k => this.refs[k] === control)
                if (!chatRefName) {
                    return
                }

                this.state.values.chats.forEach((c: ChatsListItemProps) => {
                    if (c.ref === chatRefName) {
                        c.isSelected = true
                    } else {
                        c.isSelected = false
                    }
                });
                const nextState = {
                    values: {
                        ...this.state.values,
                        isAnyChatSelected: true,
                    }
                }
                this.setState(nextState)
            },
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
                            <div class="messenger-nav__chats-list">
                                {{#each values.chats}}
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
                        </div>
                    </nav>

                    <div class="messenger-container__chat-container">
                        <p>Select a Chat</p>
                    </div>
                </div>
            </div>
        `
    }
}
