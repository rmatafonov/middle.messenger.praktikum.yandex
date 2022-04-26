import 'global-jsdom/register'
import { expect } from 'chai';
import { Component } from '../../src/core';
import { Router } from '../../src/service/front';
import GlobalStorage from '../../src/service/front/GlobalStorage';
import { UserDto } from '../../src/dto';

const PATHS = {
    HOME: '/',
    MESSENGER: '/messenger',
    PROFILE: '/profile'
};

class StubHomeComponent extends Component {
    static HTML = '<div class="StubHomeComponent"></div>'

    protected render(): string {
        return StubHomeComponent.HTML
    }
}

class StubProfileComponent extends Component {
    static HTML = '<div class="StubProfileComponent"></div>'

    protected render(): string {
        return StubProfileComponent.HTML
    }
}

describe('Test Router', () => {
    before(() => {
        GlobalStorage.getInstance().setUser(
            new UserDto('Ivan', 'Ivanov', 'iva', 'ivan.ivanov@ya.ru', '89123412423')
        )
        const app = document.createElement('div')
        app.setAttribute('id', 'app')
        document.body.appendChild(app)

        Router.getInstance('#app')
            .use(PATHS.HOME, StubHomeComponent)
            .use(PATHS.PROFILE, StubProfileComponent)
            .start()
    });

    const wrapWithAppDiv = (html: string) => `<div id="app">${html}</div>`

    it('should be at home address by default', () => {
        expect(document.body.innerHTML, 'The only Home Component should be rendered')
            .to.equal(wrapWithAppDiv(StubHomeComponent.HTML))
    });

    describe('Test Router Navigation', () => {
        beforeEach(() => Router.getInstance().go('/'))

        it('should correctly go to profile address', () => {
            Router.getInstance().go(PATHS.PROFILE)
            expect(document.body.innerHTML, 'The only Profile Component should be rendered')
                .to.equal(wrapWithAppDiv(StubProfileComponent.HTML))
        });

        it('should correctly serve back routing', () => {
            Router.getInstance().go(PATHS.PROFILE)
            Router.getInstance().back()
            setTimeout(() => {
                // Wait for window.onpopstate is fired
                expect(document.body.innerHTML, 'The only Home Component should be rendered')
                    .to.equal(wrapWithAppDiv(StubHomeComponent.HTML))
            }, 300);
        });

        it('should correctly serve forward routing', () => {
            Router.getInstance().go(PATHS.PROFILE)
            Router.getInstance().back()
            setTimeout(() => {
                // Wait for window.onpopstate is fired
                Router.getInstance().forward()
                setTimeout(() => {
                    // Wait for window.onpopstate is fired
                    expect(document.body.innerHTML, 'The only Profile Component should be rendered')
                        .to.equal(wrapWithAppDiv(StubProfileComponent.HTML))
                }, 300)
            }, 300)
        });

    })
});
