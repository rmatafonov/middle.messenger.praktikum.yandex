import Component from '../../core/Component';

import './link.css';

interface LinkProps {
  text: string;
  to: string;
}

export class Link extends Component {
  constructor(props: LinkProps) {
    const onClick = (e: MouseEvent) => {
      // const router = new Router();
      // router.go(this.props.to);

      console.log(13);

      e.preventDefault();
    }

    super({...props, events: { click: onClick }});
  }

  render() {
    // language=hbs
    return `<a href="{{to}}">{{text}}</a>`;
  }
}
