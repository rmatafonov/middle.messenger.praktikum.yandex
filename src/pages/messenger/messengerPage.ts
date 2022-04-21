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
                account: {
                    firstName: '',
                    secondName: '',
                },
                search: '',
                chatsListScrollTop: 0,
                chats: [],
                foundUsers: [],
                messages: undefined,
            },
            selectUser: (chatRefName: string) => {
                const user = this.state.values.foundUsers.find((u: UserDto) => `${u.id}` === chatRefName)
                const newTitle = `${user.firstName} ${user.secondName}`
                chatsAPI.createChat(newTitle)
                    .then(newChatId => chatsAPI.getToken(newChatId))
                    .then(token => console.log(token))
            },
            selectChat: () => {
                console.log('selected chat');
            },
            search: (e: InputEvent) => {
                const login = (e.target as HTMLInputElement).value
                if (login.length < 4) {
                    // TODO: search by existing chats only
                    this.setChildProps('chatsList', { foundUsers: [] })
                    return
                }
                userAPI.userSearch(login)
                    .then(foundUsersDto => {
                        this.state.values.foundUsers = foundUsersDto.users
                        return foundUsersDto.users.map(u => ({
                            ref: `${u.id}`,
                            isSelected: false,
                            name: `${u.firstName} ${u.secondName}`,
                            login: u.login
                        }))
                    })
                    .then(foundUsers => this.setChildProps('chatsList', { foundUsers }))
            }
        }
    }

    componentDidMount() {
        chatsAPI.getChats()
            .then(chatsDto => {
                chatsDto.chats.forEach(chatDto => {
                    chatDto.ref = `ref-${chatDto.id}`
                })
                const nextState = {
                    values: {
                        ...this.state.values,
                        chats: chatsDto.chats
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
                                    onUserSelected=selectUser
                                    onChatSelected=selectChat
                            }}}
                        </div>
                    </nav>

                    {{#if values.messages}}
                    {{{ Chat messages=values.messages }}}
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
