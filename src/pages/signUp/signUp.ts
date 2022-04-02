import { Component } from '../../core';
import { validate } from '../../service/validation'

import "../css/signin-signup.scss"

export class SignUpPage extends Component {
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
                confirmPassword: '',
                firstName: '',
                secondName: '',
                email: '',
                phone: '',
            },
            errors: {
                login: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                secondName: '',
                email: '',
                phone: '',
            },
            onFocusOrBlur: (e: InputEvent) => this.validateControl(e),
            onFocusOrBlurConfirmPassword: (e: InputEvent) => {
                const password = (this.refs.password.querySelector("input") as HTMLInputElement).value
                const confirmPassword = (e.target! as HTMLInputElement).value
                if (password !== confirmPassword) {
                    this.setChildProps("confirmPasswordError", { text: 'Passwords does not match' })
                } else {
                    this.setChildProps("confirmPasswordError", { text: '' })
                }
            },
            onSubmit: () => {
                const signInData = {
                    login: (this.refs.login.querySelector("input") as HTMLInputElement).value,
                    password: (this.refs.password.querySelector("input") as HTMLInputElement).value,
                    confirmPassword: (this.refs.confirmPassword.querySelector("input") as HTMLInputElement).value,
                    firstName: (this.refs.firstName.querySelector("input") as HTMLInputElement).value,
                    secondName: (this.refs.secondName.querySelector("input") as HTMLInputElement).value,
                    email: (this.refs.email.querySelector("input") as HTMLInputElement).value,
                    phone: (this.refs.phone.querySelector("input") as HTMLInputElement).value,
                };

                const nextState = {
                    errors: {
                        login: '',
                        password: '',
                        confirmPassword: '',
                        firstName: '',
                        secondName: '',
                        email: '',
                        phone: '',
                    },
                    values: { ...signInData },
                };

                nextState.errors.login = validate("login", signInData.login)
                nextState.errors.password = validate("password", signInData.password)
                nextState.errors.confirmPassword = signInData.password === signInData.confirmPassword ? '' : 'Passwords does not match'
                nextState.errors.firstName = validate("first_name", signInData.firstName)
                nextState.errors.secondName = validate("second_name", signInData.secondName)
                nextState.errors.email = validate("email", signInData.email)
                nextState.errors.phone = validate("phone", signInData.phone)

                this.setState(nextState);

                if (!nextState.errors.login
                    && !nextState.errors.password
                    && !nextState.errors.confirmPassword
                    && !nextState.errors.firstName
                    && !nextState.errors.secondName
                    && !nextState.errors.email
                    && !nextState.errors.phone
                ) {
                    console.log('action/signUp', signInData);
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

                    <h2>Sign Up</h2>
                    <div id="status" class="mini-text signin-container__error-default">{{errorText}}</div>

                    <form>
                        <div class="form-indents">
                            {{{ Input
                                    value="${values.firstName}"
                                    ref="firstName"
                                    type="text"
                                    id="first_name"
                                    className="input-box__moving-label"
                                    label="First Name *"
                                    onFocus=onFocusOrBlur
                                    onBlur=onFocusOrBlur
                            }}}
                            {{{
                                Label
                                    id="firstNameErrorLabel"
                                    ref="first_nameError"
                                    text="${errors.firstName}"
                                    className="mini-text label__error"
                            }}}
                        </div>
                        <div class="form-indents">
                            {{{ Input
                                    value="${values.secondName}"
                                    ref="secondName"
                                    type="text"
                                    id="second_name"
                                    className="input-box__moving-label"
                                    label="Second Name *"
                                    onFocus=onFocusOrBlur
                                    onBlur=onFocusOrBlur
                            }}}
                            {{{
                                Label
                                    id="secondNameErrorLabel"
                                    ref="second_nameError"
                                    text="${errors.secondName}"
                                    className="mini-text label__error"
                            }}}
                        </div>
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
                        <div class="form-indents">
                            {{{ Input
                                    value="${values.confirmPassword}"
                                    ref="confirmPassword"
                                    type="password" 
                                    id="confirmPassword" 
                                    className="input-box__moving-label" 
                                    label="Confirm Password *" 
                                    onFocus=onFocusOrBlurConfirmPassword
                                    onBlur=onFocusOrBlurConfirmPassword
                            }}}
                            {{{
                                Label
                                    id="confirmPasswordErrorLabel"
                                    ref="confirmPasswordError"
                                    text="${errors.confirmPassword}"
                                    className="mini-text label__error"
                            }}}
                        </div>
                        <div class="form-indents">
                            {{{ Input
                                    value="${values.email}"
                                    ref="email"
                                    type="text"
                                    id="email"
                                    className="input-box__moving-label"
                                    label="Email *"
                                    onFocus=onFocusOrBlur
                                    onBlur=onFocusOrBlur
                            }}}
                            {{{
                                Label
                                    id="emailErrorLabel"
                                    ref="emailError"
                                    text="${errors.email}"
                                    className="mini-text label__error"
                            }}}
                        </div>
                        <div class="form-indents">
                            {{{ Input
                                    value="${values.phone}"
                                    ref="phone"
                                    type="text"
                                    id="phone"
                                    className="input-box__moving-label"
                                    label="Phone *"
                                    onFocus=onFocusOrBlur
                                    onBlur=onFocusOrBlur
                            }}}
                            {{{
                                Label
                                    id="phoneErrorLabel"
                                    ref="phoneError"
                                    text="${errors.phone}"
                                    className="mini-text label__error"
                            }}}
                        </div>


                        {{{ Button id="submit" className="form-container__button-box form-indents" text="Sign Up" onClick=onSubmit }}}
                    </form>

                    <div class="mini-text signin-container__links-box form-half-indents">
                        <span class="links-box__center"><a href="./signIn.html">Sign In</a></span>
                    </div>

                    <div class="mini-text signin-container__links-box form-double-indents">
                        <span class="links-box__center">Copyright © <a href="#">Your Website</a> 2022.</span>
                    </div>
                </div>
            </div>
        `
    }
}
