import { Component } from '../../core';
import { validate } from '../../service/validation'

import "../css/signin-signup.scss"

export class SignInPage extends Component {
    private validateControl = (e: InputEvent) => {
        const control = (e.target! as HTMLInputElement);
        const controlName = control.name

        const validationResult = validate(controlName, control.value)

        const errorLabelRefName = `${controlName}Error`
        this.setChildProps(errorLabelRefName, { text: validationResult })
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
            onFocusOrBlur: (e: InputEvent) => this.validateControl(e),
            onSubmit: () => {
                const signInData = {
                    login: (this.refs.login.querySelector("input") as HTMLInputElement).value,
                    password: (this.refs.password.querySelector("input") as HTMLInputElement).value,
                    rememberMe: (this.refs.rememberMe.querySelector("input") as HTMLInputElement).checked
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

                if (!nextState.errors.login && !nextState.errors.password) {
                    console.log('action/signIn', signInData);
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
                                    onFocus=onFocusOrBlur
                                    onBlur=onFocusOrBlur
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
                                    onFocus=onFocusOrBlur
                                    onBlur=onFocusOrBlur
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
                        <span class="links-box__left"><a href="./forgot.html">Forgot Password?</a></span>
                        <span class="links-box__right"><a href="./signUp.html">Sign Up</a></span>
                    </div>

                    <div class="mini-text signin-container__links-box form-double-indents">
                        <span class="links-box__center">Copyright © <a href="#">Your Website</a> 2022.</span>
                    </div>
                </div>
            </div>
        `
    }
}
