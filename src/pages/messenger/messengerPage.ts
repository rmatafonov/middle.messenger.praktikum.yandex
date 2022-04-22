import { Component } from '../../core';

import './css/messenger.scss'
import defaultAvatar from '../../img/camera_200.png'
import GlobalStorage from '../../service/front/GlobalStorage';
import { Router } from '../../service/front';
import { chatsAPI } from '../../service/back/api/chatsAPI';
import { userAPI } from '../../service/back';
import { UserDto } from '../../dto';

export class MessengerPage extends Component {
    protected getStateFromProps() {
        this.state = {
            values: {
                search: '',
                chats: [],
                foundUsers: undefined,
                chatData: undefined,
            },
            onUserSelected: (refName: string) => {
                const searchValue = this.retrieveChildByRef("search").getStringValue()
                const user = this.state.values.foundUsers.find((u: UserDto) => `${u.id}` === refName)
                const newTitle = `${user.firstName} ${user.secondName}`
                chatsAPI.createChat(newTitle)
                    .then(newChatId => {
                        chatsAPI.addUserToChat(user.id, newChatId)
                        return newChatId
                    })
                    .then(newChatId => {
                        return {
                            chatId: newChatId,
                            tokenPromise: chatsAPI.getToken(newChatId)
                        }
                    })
                    .then(tokenPromiseWithChatId => {
                        tokenPromiseWithChatId.tokenPromise.then(token => {
                            const nextState = {
                                values: {
                                    ...this.state.values,
                                    search: searchValue,
                                    chatData: {
                                        userId: user.id,
                                        chatId: tokenPromiseWithChatId.chatId,
                                        token
                                    }
                                }
                            }
                            this.setState(nextState)
                        })
                    })
            },
            onFirstMessageSent: () => {
                this.retrieveChats(this.state.chatData.userId)
            },
            selectChat: () => {
                console.log('selected chat');
            },
            search: (e: InputEvent) => {
                const login = (e.target as HTMLInputElement).value
                if (login.length < 4) {
                    // TODO: search by existing chats only
                    this.setChildProps('chatsList', { foundUsers: undefined })
                    return
                }
                userAPI.userSearch(login)
                    .then(foundUsersDto => {
                        this.state.values.foundUsers = foundUsersDto.users
                        return foundUsersDto.users
                    })
                    .then(foundUsers => this.setChildProps('chatsList', { foundUsers }))
            }
        }
    }

    componentDidMount() {
        this.retrieveChats()
    }

    private retrieveChats(selectedUserId?: number) {
        chatsAPI.getChats()
            .then(chatsDto => {
                chatsDto.chats.forEach(c => {
                    if (c.lastMessage?.user.id === selectedUserId) {
                        c.isSelected = true
                    } else {
                        c.isSelected = false
                    }
                })
                const nextState = {
                    values: {
                        ...this.state.values,
                        search: '',
                        chats: chatsDto.chats,
                        foundUsers: undefined,
                    }
                }
                this.setState(nextState)
            })
    }

    protected render(): string {
        const { values } = this.state;
        const user = GlobalStorage.getInstance().storage.user
        if (!user) {
            Router.getInstance().go('/')
            return '<div></div>'
        }

        return /*html*/`
            <div class="messenger-page">
                <div class="messenger-container">
                    <nav class="messenger-container__nav">
                        <div class="nav__header">
                            <div class="chats-container__profie-container">
                                <div class="chats-container__profie-photo">
                                    <img src="${defaultAvatar}" alt="Ph">
                                </div>
                                <div class="chats-container__profie-name">${user!.firstName} ${user!.secondName} (me)</div>
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
                                        onChange=search
                                }}}
                            </div>
                            <hr>
                        </div>
                        <div class="messenger-nav__chats-list-container">
                            {{{ ChatsList
                                    ref="chatsList"
                                    chats=values.chats
                                    foundUsers=values.foundUsers
                                    onUserSelected=onUserSelected
                                    onChatSelected=selectChat
                            }}}
                        </div>
                    </nav>

                    {{#if values.chatData}}
                    {{{ Chat 
                            ref='chat' 
                            userId=values.chatData.userId
                            chatId=values.chatData.chatId
                            token=values.chatData.token
                            onFirstMessageSent=onFirstMessageSent
                    }}}
                    {{else}}
                    <div class="messenger-container__chat-container">
                        <p>Select a Chat</p>
                    </div>
                    {{/if}}
                </div>
            </div>
        `
    }
}
