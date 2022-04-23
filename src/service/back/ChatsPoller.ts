import { EventBus } from '../../core';
import { ChatsListItemDto } from '../../dto';
import { cloneDeep, isEqual } from '../../utils';
import { chatsAPI } from './api/chatsAPI';

export class ChatsPoller {
    static EVENTS = {
        CHATS_UPDATED: 'chats-updated'
    } as const

    private currentChats?: Array<ChatsListItemDto>
    private started: boolean = false
    private shouldPolling: boolean = true

    eventBus: EventBus = new EventBus()

    private static instance?: ChatsPoller

    static getInstance() {
        if (!this.instance) {
            this.instance = new ChatsPoller()
        }
        return this.instance
    }

    start() {
        if (this.started) {
            return
        }
        console.log('Start polling');
        this.started = true
        this.shouldPolling = true
        this._start()
    }

    private _start(timeout: number = 0) {
        setTimeout(() => {
            this.retrieveChats()
            if (this.shouldPolling) {
                this._start(5000)
            }
        }, timeout);
    }

    stop() {
        console.log('Stop polling');
        this.shouldPolling = false
        this.started = false
    }

    forceUpdate() {
        console.log('Force run');
        this.retrieveChats(true)
    }

    private retrieveChats(forceUpdate: boolean = false) {
        chatsAPI.getChats()
            .then(chatsDto => chatsDto.chats)
            .then(chats => {
                if (!forceUpdate && isEqual(chats, this.currentChats)) {
                    return
                }
                console.log('New chats found');
                this.currentChats = chats
                this.eventBus.emit(ChatsPoller.EVENTS.CHATS_UPDATED, cloneDeep(chats))
            })
            .catch(_err => this.stop())
    }
}
