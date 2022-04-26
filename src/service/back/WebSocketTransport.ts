import { EventBus } from '../../core'
import { WSMessageDto } from '../../dto'
import WSMessagesListDto from '../../dto/WSMessagesListDto'
import GlobalStorage from '../front/GlobalStorage'

export default class WebSocketTransport {
    static EVENTS = {
        WS_MESSAGES_ARRIVED: 'ws-messages-arrived'
    } as const

    eventBus: EventBus

    private static WS_EVENTS = {
        PING: 'ping',
        PONG: 'pong',
        USER_CONNECTED: 'user connected',
        GET_OLD: 'get old',
        MESSAGE: 'message',
    } as const

    private static SERVICE_MESSAGE_TYPES = [
        WebSocketTransport.WS_EVENTS.USER_CONNECTED,
        WebSocketTransport.WS_EVENTS.PONG
    ]

    private socket: WebSocket
    private keepWSConnection: boolean = false

    constructor(chatId: number, token: string) {
        this.eventBus = new EventBus()

        const user = GlobalStorage.getInstance().storage.user
        if (!user) {
            throw Error('Not authenticated')
        }
        this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${user?.id}/${chatId}/${token}`)

        this.initOpenListener()
        this.initCloseListener()
        this.initMessageListener()
        this.initErrorListener()
    }

    start() {
        this.keepWSConnection = true
        this.startPingingSocket()
    }

    stop() {
        this.keepWSConnection = false
    }

    send(message: string) {
        this.socket!.send(JSON.stringify({
            content: message,
            type: WebSocketTransport.WS_EVENTS.MESSAGE,
        }));
    }

    private initOpenListener() {
        this.socket.onopen = () => {
            console.log('Connected to web socket')
            this.requestGetOldMessages()
        }
    }

    private startPingingSocket(timeout: number = 1000) {
        setTimeout(() => {
            this.socket?.send(JSON.stringify({
                type: WebSocketTransport.WS_EVENTS.PING,
            }))
            if (this.keepWSConnection) {
                this.startPingingSocket()
            }
        }, timeout)
    }

    private requestGetOldMessages() {
        this.socket!.send(JSON.stringify({
            content: '0',
            type: WebSocketTransport.WS_EVENTS.GET_OLD,
        }))
    }

    private initCloseListener() {
        this.socket.onclose = event => {
            if (event.wasClean) {
                console.log('Closed connection')
            } else {
                console.log('Connection interrupted')
            }
            console.log(`Code: ${event.code} | Reason: ${event.reason}`)
        }
    }

    private initMessageListener() {
        this.socket.onmessage = event => {
            console.log('Receved data', event.data)
            const json = JSON.parse(event.data)
            if (WebSocketTransport.SERVICE_MESSAGE_TYPES.includes(json.type)) {
                return
            }

            let messages: WSMessagesListDto
            if (Array.isArray(json)) {
                messages = WSMessagesListDto.fromJson(json)
            } else {
                messages = new WSMessagesListDto([WSMessageDto.fromJson(json)])
            }
            this.eventBus.emit(WebSocketTransport.EVENTS.WS_MESSAGES_ARRIVED, messages)
        }
    }

    private initErrorListener() {
        this.socket.onerror = event => {
            console.log('Error', event)
        }
    }
}
