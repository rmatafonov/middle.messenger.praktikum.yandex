import { Component } from '../../core';

import './css/messenger.scss'
import GlobalStorage from '../../service/front/GlobalStorage';
import { Router } from '../../service/front';
import { chatsAPI } from '../../service/back/api/chatsAPI';
import { userAPI } from '../../service/back';
import { ChatsListItemDto, UserDto } from '../../dto';
import { ChatsPoller } from '../../service/back/ChatsPoller';

export class MessengerPage extends Component {
    protected getStateFromProps() {
        this.state = {
            values: {
                userName: '',
                search: '',
                isSearching: false,
                chats: [],
                foundUsers: undefined,
                chatData: undefined,
            },
            onProfileClick: () => {
                Router.getInstance().go('/profile')
            },
            onFoundUserSelected: (refName: string) => {
                const searchValue = this.retrieveChildByRef("search").getStringValue()
                const currentUser = GlobalStorage.getInstance().storage.user
                const user = this.state.values.foundUsers.find((u: UserDto) => `${u.id}` === refName)
                const newTitle = `${currentUser?.login}-${user.login}`
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
                                    isSearching: true,
                                    chatData: {
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
                this.state.values.isSearching = false
                ChatsPoller.getInstance().forceUpdate()
            },
            selectChat: (chat: ChatsListItemDto) => {
                const chatComponent = this.retrieveChildByRef('chat')
                if (chatComponent) {
                    chatComponent.eventBus().emit(Component.EVENTS.FLOW_WILL_UNMOUNT)
                }

                chatsAPI.getToken(chat.id)
                    .then(token => {
                        const nextState = {
                            values: {
                                ...this.state.values,
                                chatData: {
                                    chatId: chat.id,
                                    token: token
                                }
                            }
                        }
                        this.setState(nextState)
                    })

            },
            search: (e: InputEvent) => {
                const login = (e.target as HTMLInputElement).value
                if (login.length < 4) {
                    this.setChildProps(
                        'chatsList',
                        {
                            search: this.state.values.search,
                            foundUsers: undefined
                        }
                    )
                    return
                }
                userAPI.userSearch(login)
                    .then(foundUsersDto => {
                        this.state.values.foundUsers = foundUsersDto.users
                        return foundUsersDto.users
                    })
                    .then(foundUsers => {
                        this.setChildProps(
                            'chatsList',
                            {
                                search: this.state.values.search,
                                foundUsers: foundUsers
                            }
                        )
                    })
            }
        }
    }

    componentDidMount() {
        const user = GlobalStorage.getInstance().storage.user
        if (!user) {
            ChatsPoller.getInstance().stop()
            Router.getInstance().go('/')
            return
        }

        const nextState = {
            values: {
                ...this.state.values,
                userName: user.displayName,
            }
        }
        this.setState(nextState)

        ChatsPoller.getInstance().start()
        ChatsPoller.getInstance().eventBus.on(
            ChatsPoller.EVENTS.CHATS_UPDATED,
            chats => {
                const selectedChat = this.getSelectedChat()
                if (selectedChat) {
                    this.selectSameChat(chats, selectedChat)
                }
                const isSearching = this.state.values.isSearching
                if (!isSearching) {
                    const nextState = {
                        values: {
                            ...this.state.values,
                            search: isSearching ? this.state.values.search : '',
                            chats: chats,
                            foundUsers: isSearching ? this.state.values.foundUsers : undefined,
                        }
                    }
                    this.setState(nextState)
                }
            }
        )
    }

    private getSelectedChat(): ChatsListItemDto {
        return this.state.values.chats.find((c: ChatsListItemDto) => c.isSelected)
    }

    private selectSameChat(chats: Array<ChatsListItemDto>, selectedChat: ChatsListItemDto) {
        const chatToSelect = chats.find(c => c.id = selectedChat.id)
        if (chatToSelect) {
            chatToSelect.isSelected = true
        }
    }

    protected render(): string {
        const { values } = this.state;

        return /*html*/`
            <div class="messenger-page">
                <div class="messenger-container">
                    <nav class="messenger-container__nav">
                        <div class="nav__header">
                            {{{ MessengerHeader
                                    userName=values.userName
                                    onClick=onProfileClick
                            }}}
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
                                    onFoundUserSelected=onFoundUserSelected
                                    onChatSelected=selectChat
                            }}}
                        </div>
                    </nav>

                    {{#if values.chatData}}
                    {{{ Chat 
                            ref='chat' 
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
