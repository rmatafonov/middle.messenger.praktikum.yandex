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
            throw Error('The rootQuery parameter is required to created the Router instance')
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
            console.log(`[Router] onpopstate to '${target.location.pathname}'`);
            if (target) {
                this.onRoute(target.location.pathname);
            }
        };

        this.onRoute(window.location.pathname);
    }

    private onRoute(pathname: string) {
        const currentUser = GlobalStorage.getInstance().storage.user
        if (!currentUser) {
            console.log('[Router] user is undefined. Going home');
            pathname = '/'
        }
        
        const route = this.getRoute(pathname);
        if (!route) {
            console.log(`[Router] no route for pathname ${pathname}`);
            return
        }

        if (this.currentRoute) {
            this.currentRoute.leave();
        }

        console.log(`[Router] navigating to '${pathname}'`);
        this.currentRoute = route;
        route.render();
    }

    go(pathname: string) {
        console.log(`[Router] go to ${pathname}`);
        this.history.pushState({}, '', pathname);
        this.onRoute(pathname);
    }

    back() {
        console.log('[Router] back');
        window.history.back();
    }

    forward() {
        console.log('[Router] forward');
        window.history.forward();
    }

    private getRoute(pathname: string) {
        return this.routes.find(route => route.match(pathname));
    }
}
