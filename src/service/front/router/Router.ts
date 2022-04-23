import GlobalStorage from '../GlobalStorage';
import Route from './Route';

export default class Router {
    private routes: Array<Route<any>> = [];
    private history = window.history;
    private currentRoute?: Route<any> = undefined;
    private rootQuery!: string;
    private static instance?: Router = undefined

    static getInstance(rootQuery?: string): Router {
        if (this.instance) {
            return this.instance
        }

        if(!rootQuery) {
            throw Error('The Router has not been created yet')
        }

        this.instance = new Router(rootQuery)
        return this.instance
    }

    private constructor(rootQuery: string) {
        this.rootQuery = rootQuery;
    }

    use(pathname: string, component: ComponentConstructable) {
        const route = new Route(pathname, component, { rootQuery: this.rootQuery });
        this.routes.push(route);
        return this;
    }

    start() {
        window.onpopstate = (event: PopStateEvent) => {
            const target = event.currentTarget as Window
            if (target) {
                this._onRoute(target.location.pathname);
            }
        };

        this._onRoute(window.location.pathname);
    }

    _onRoute(pathname: string) {
        const currentUser = GlobalStorage.getInstance().storage.user
        if (!currentUser) {
            pathname = '/'
        }
        
        const route = this.getRoute(pathname);
        if (!route) {
            return
        }

        if (this.currentRoute) {
            this.currentRoute.leave();
        }

        this.currentRoute = route;
        route.render();
    }

    go(pathname: string) {
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }

    getRoute(pathname: string) {
        return this.routes.find(route => route.match(pathname));
    }
}
