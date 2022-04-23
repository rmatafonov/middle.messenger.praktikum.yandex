import { EventBus } from '../../core'
import { UserDto } from '../../dto';

export default class GlobalStorage {
    static EVENTS = {
        STORAGE_USER_SET: 'storage:user-set',
    } as const;

    storage: GlobalStorageData
    eventBus: EventBus
    private static instance: GlobalStorage

    static getInstance() {
        if (!this.instance) {
            this.instance = new GlobalStorage()
        }
        return this.instance
    }

    constructor() {
        this.storage = { user: undefined }
        this.eventBus = new EventBus()
    }

    setUser = (user: UserDto) => {
        this.storage.user = user
        this.eventBus.emit(GlobalStorage.EVENTS.STORAGE_USER_SET)
    }
}
