import Component from '../../../core/Component'
import renderDOM from '../../../core/renderDOM'

export default class Route<P extends {}> {
    private pathname: string
    private componentClass: ComponentConstructable
    private component?: Component
    private props: P

    constructor(pathname: string, view: ComponentConstructable, props: P) {
        this.pathname = pathname;
        this.componentClass = view;
        this.component = undefined;
        this.props = props;
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this.pathname = pathname;
            this.render();
        }
    }

    leave() {
        if (this.component) {
            this.component.hide();
        }
    }

    match(pathname: string) {
        return pathname === this.pathname;
    }

    render() {
        if (!this.component) {
            this.component = new this.componentClass(this.props);
            renderDOM(this.component!);
            return;
        }

        this.component.show();
    }
}
