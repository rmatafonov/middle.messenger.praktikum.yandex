import Component from '../../core/Component';
import { Router } from '../../service/front';

import './link.scss';

export class Link extends Component<LinkProps> {
  constructor(props: LinkProps) {
    super(props);
  }

  init() {
    this.events = {}
    if (this.props.onClick) {
      this.events.click = this.props.onClick
    } else {
      this.events.click = (e: PointerEvent) => {
        e.preventDefault()
        const pathname = (e.target! as HTMLAnchorElement).pathname
        Router.getInstance().go(pathname)
      }
    }
  }

  protected render(): string {
    // language=hbs
    return /*html*/`
      <a href="{{href}}">{{text}}</a>
    `;
  }
}
