import Component from '../../core/Component'
import defaultAvatar from '../../img/camera_200.png'
import './messengerHeader.scss'

export class MessengerHeader extends Component<MessengerHeaderProps> {
  constructor(props: MessengerHeaderProps) {
    super(props)
  }

  init() {
    this.events = {}
    if (this.props.onClick) {
      this.events.click = this.props.onClick
    }
  }

  protected render(): string {
    return /*html*/`
      <div class="chats-container__profie-container">
          <div class="chats-container__profie-photo">
              <img src="${defaultAvatar}" alt="Ph">
          </div>
          <div class="chats-container__profie-name">{{userName}} (me)</div>
      </div>
    `
  }
}
