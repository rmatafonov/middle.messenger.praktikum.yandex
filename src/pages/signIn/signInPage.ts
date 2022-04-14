import { Component, Router } from '../../core';
import { validate } from '../../service/validation'

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
                    Router.getInstance().go("/messenger")
                }
            }
        }
    }

    protected render(): string {
        const { errors, values } = this.state;

        return /*html*/`
            <div class="signin-page">
                <div class="signin-page__container">
                    <div class="signin-container__logo"></div>

                    <h2>Sign In</h2>
                    <div id="status" class="mini-text signin-container__error-default">Invalid login/password</div>

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
