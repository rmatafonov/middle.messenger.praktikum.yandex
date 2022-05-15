import { registerComponent } from './core';
import components from './components'

import './app.scss';
import SignInPage from './pages/signIn';
import SignUpPage from './pages/signUp';
import ProfilePage from './pages/profile';
import ChangePassword from './pages/changePassword';
import MessengerPage from './pages/messenger';
import ForgotPage from './pages/forgot';
import { Router } from './service/front';

components.forEach(c => registerComponent(c));

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
