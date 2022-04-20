import { Component } from '../../core';
import { authAPI } from '../../service/back';
import { Router } from '../../service/front';
import GlobalStorage from '../../service/front/GlobalStorage';
import { validate } from '../../service/front/validation'

import "../css/signin-signup.scss"

export class SignInPage extends Component {
    private validateInputAndSetError(event: InputEvent, component: Component) {
        const control = (event.target! as HTMLInputElement);
        const controlName = control.name

        const validationResult = validate(controlName, control.value)

        const errorLabelRefName = `${controlName}Error`
        component.setChildProps(errorLabelRefName, { text: validationResult })
    }

    private clearError(event: InputEvent, component: Component) {
        const control = (event.target! as HTMLInputElement);
        const controlName = control.name
        const errorLabelRefName = `${controlName}Error`
        component.setChildProps(errorLabelRefName, { text: '' })
    }

    protected getStateFromProps() {
        this.state = {
            apiStatus: '',
            values: {
                login: '',
                password: '',
                rememberMe: false
            },
            errors: {
                login: '',
                password: '',
            },
            onFocus: (e: InputEvent) => this.clearError(e, this),
            onBlur: (e: InputEvent) => this.validateInputAndSetError(e, this),
            onSubmit: () => {
                const signInData = {
                    login: this.retrieveChildByRef("login").getStringValue(),
                    password: this.retrieveChildByRef("password").getStringValue(),
                    rememberMe: this.retrieveChildByRef("rememberMe").getBooleanValue()
                };

                const nextState = {
                    apiStatus: '',
                    errors: {
                        login: '',
                        password: '',
                    },
                    values: { ...signInData },
                };

                nextState.errors.login = validate("login", signInData.login);
                nextState.errors.password = validate("password", signInData.password);

                this.setState(nextState);

                if (Object.values(nextState.errors).every(e => !e)) {
                    console.log('action/signIn', signInData);
                    authAPI.signIn(signInData)
                        .then(res => {
                            if (!res) {
                                throw Error('The web app error - something wrong with auth')
                            }
                            this.initUser()
                        })
                        .catch(err => {
                            const nextState = {
                                apiStatus: err
                            }
                            this.setState(nextState)
                        })
                }
            }
        }
    }

    private initUser() {
        authAPI.getUser()
            .then(user => {
                GlobalStorage.getInstance().setUser(user)
                Router.getInstance().go("/messenger")
            })
    }

    init() {
        this.initUser()
    }

    protected render(): string {
        const { errors, values, apiStatus } = this.state;

        return /*html*/`
            <div class="signin-page">
                <div class="signin-page__container">
                    <div class="signin-container__logo"></div>

                    <h2>Sign In</h2>
                    {{{
                        Label
                            id="status"
                            ref="status"
                            text="${apiStatus}"
                            className="mini-text label__error label__center-aligned"
                    }}}

                    <form>
                        <div class="form-indents">
                            {{{ Input
                                    value="${values.login}"
                                    ref="login"
                                    type="text"
                                    id="login"
                                    className="input-box__moving-label"
                                    label="Login *"
                                    onFocus=onFocus
                                    onBlur=onBlur
                            }}}
                            {{{
                                Label
                                    id="loginErrorLabel"
                                    ref="loginError"
                                    text="${errors.login}"
                                    className="mini-text label__error"
                            }}}
                        </div>
                        <div class="form-indents">
                            {{{ Input
                                    value="${values.password}"
                                    ref="password"
                                    type="password" 
                                    id="password" 
                                    className="input-box__moving-label" 
                                    label="Password *" 
                                    onFocus=onFocus
                                    onBlur=onBlur
                            }}}
                            {{{
                                Label
                                    id="passwordErrorLabel"
                                    ref="passwordError"
                                    text="${errors.password}"
                                    className="mini-text label__error"
                            }}}
                        </div>

                        {{{ Checkbox
                                id="remember-me"
                                checked=${values.rememberMe}
                                ref="rememberMe"
                                className="form-container__checkbox form-indents" 
                                label="Remember Me" 
                        }}}

                        {{{ Button 
                                className="form-container__button-box form-indents" 
                                text="Sign In"
                                onClick=onSubmit
                        }}}
                    </form>

                    <div class="mini-text signin-container__links-box form-half-indents">
                        <span class="links-box__left">{{{Link href="/forgot" text="Forgot Password?"}}}</span>
                        <span class="links-box__right">{{{Link href="/sign-up" text="Sign Up"}}}</span>
                    </div>

                    <div class="mini-text signin-container__links-box form-double-indents">
                        <span class="links-box__center">Copyright © <a>Your Website</a> 2022.</span>
                    </div>
                </div>
            </div>
        `
    }
}
