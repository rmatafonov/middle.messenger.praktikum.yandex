import { Button } from './button/button';
import { Checkbox } from './checkbox/checkbox';
import { Input } from './input/input';
import { Label } from './label/label';
import { Link } from './link/link';

import { Chat } from './chat/chat';
import { ChatsList } from './chatsList/chatsList';
import { ChatsListItem } from './chatsListItem/chatsListItem';
import { MessageBox } from './messageBox/messageBox';
import { MessagesContainer } from './messagesContainer/messagesContainer';
import { MessengerHeader } from './messengerHeader/messengerHeader';

const components: Array<ComponentConstructable> = [
    Button,
    Checkbox,
    Input,
    Label,
    Link,
    Chat,
    ChatsList,
    ChatsListItem,
    MessageBox,
    MessagesContainer,
    MessengerHeader,
]

export default components
