import Component from '../../core/Component';
import { Router } from '../../service/front';

import './link.scss';

export class Link extends Component<LinkProps> {
  constructor(props: LinkProps) {
    super(props);
  }

  init() {
    this.events = {
      click: this.getOnClick()
    }
  }

  private getOnClick() {
    const defaultOnClick = (e: PointerEvent) => {
      e.preventDefault()
      const pathname = (e.target! as HTMLAnchorElement).pathname
      Router.getInstance().go(pathname)
    }
    return this.props.onClick || defaultOnClick
  }

  protected render(): string {
    // language=hbs
    return /*html*/`
      <a href="{{href}}">{{text}}</a>
    `;
  }
}
