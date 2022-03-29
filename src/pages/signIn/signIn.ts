import { Block } from '../../core';

import "./signin-signup.scss"

export class SignInPage extends Block {
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
            validate: {
                login: (login: string) => {
                    if (!login) {
                        return 'Login is required';
                    } else if (login.length < 4) {
                        return 'Login should contain more than 3 chars';
                    }
                    return '';
                },
                password: (password: string) => {
                    if (!password) {
                        return 'Password is required';
                    }
                    return '';
                }
            },
            validateValue: (e: InputEvent) => {
                const control = (e.target! as HTMLInputElement);
                const controlName = control.name

                const errorLabelRefName = `${controlName}Error`
                const errorRef = this.refs[errorLabelRefName]

                const errorLabels = Object.values(this.children).filter(c => c.getContent() === errorRef)
                if (errorLabels.length !== 1) {
                    console.warn(`1 Ref with Name ${controlName}Error is expected but was: ${errorLabels}`)
                }
                const errorLabel = errorLabels[0]

                errorLabel.setProps({ text: this.state.validate[controlName](control.value) })
                this.children[errorLabel.id] = errorLabel
                this.refs[errorLabelRefName] = errorLabel.getContent()
            },
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

                nextState.errors.login = this.state.validate.login(signInData.login);
                nextState.errors.password = this.state.validate.password(signInData.password);

                this.setState(nextState);

                if (!nextState.errors.login && !nextState.errors.password) {
                    console.log('action/login', signInData);
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
                        <div class="form-idents">
                            {{{ Input
                                    value="${values.login}"
                                    ref="login"
                                    type="text"
                                    id="login"
                                    className="input-box__moving-label"
                                    label="Login *"
                                    onFocus=validateValue
                                    onBlur=validateValue
                            }}}
                            {{{
                                Label
                                    id="loginErrorLabel"
                                    ref="loginError"
                                    text="${errors.login}"
                                    className="mini-text label__error"
                            }}}
                        </div>
                        <div class="form-idents">
                            {{{ Input
                                    value="${values.password}"
                                    ref="password"
                                    type="password" 
                                    id="password" 
                                    className="input-box__moving-label" 
                                    label="Password *" 
                                    onFocus=validateValue
                                    onBlur=validateValue
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
                                className="form-container__checkbox form-idents" 
                                label="Remember Me" 
                        }}}

                        {{{ Button 
                                className="form-container__button-box form-idents" 
                                text="Sign In"
                                onClick=onSubmit
                        }}}
                    </form>

                    <div class="mini-text signin-container__links-box form-half-idents">
                        <span class="links-box__left"><a href="./forgot.hbs">Forgot Password?</a></span>
                        <span class="links-box__right"><a href="./signUp.hbs">Sign Up</a></span>
                    </div>

                    <div class="mini-text signin-container__links-box form-double-idents">
                        <span class="links-box__center">Copyright © <a href="#">Your Website</a> 2022.</span>
                    </div>
                </div>
            </div>
        `
    }
}
