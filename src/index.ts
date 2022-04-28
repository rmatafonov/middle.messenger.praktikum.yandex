import { registerComponent } from './core';
import { capitalizeFirstLetter } from './utils/stringUtils'
import * as components from './components/*/index.ts'

import './app.scss';
import SignInPage from './pages/signIn';
import SignUpPage from './pages/signUp';
import ProfilePage from './pages/profile';
import ChangePassword from './pages/changePassword';
import MessengerPage from './pages/messenger';
import ForgotPage from './pages/forgot';
import { Router } from './service/front';

Object.entries(components as { [key: string]: { default: ComponentConstructable } }).forEach(([name, component]) => {
    registerComponent(capitalizeFirstLetter(name), component.default)
});

document.addEventListener('DOMContentLoaded', () => {
    const router = Router.getInstance('#app')
    router.use('/', SignInPage)
        .use("/forgot", ForgotPage)
        .use('/sign-up', SignUpPage)
        .use('/profile', ProfilePage)
        .use('/changePassword', ChangePassword)
        .use('/messenger', MessengerPage)
        .start()
});
