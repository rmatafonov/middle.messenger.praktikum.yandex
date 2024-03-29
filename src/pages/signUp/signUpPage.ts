import { Component } from '../../core';
import { UserDto } from '../../dto';
import { authAPI } from '../../service/back';
import { Router } from '../../service/front';
import GlobalStorage from '../../service/front/GlobalStorage';
import { validate } from '../../service/front/validation'

import "../css/signin-signup.scss"

export class SignUpPage extends Component {
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
            onFocus: (e: InputEvent) => this.clearError(e, this),
            onBlur: (e: InputEvent) => this.validateInputAndSetError(e, this),
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
                const signUpData = {
                    login: this.retrieveChildByRef("login").getStringValue(),
                    password: this.retrieveChildByRef("password").getStringValue(),
                    confirmPassword: this.retrieveChildByRef("confirmPassword").getStringValue(),
                    firstName: this.retrieveChildByRef("firstName").getStringValue(),
                    secondName: this.retrieveChildByRef("secondName").getStringValue(),
                    email: this.retrieveChildByRef("email").getStringValue(),
                    phone: this.retrieveChildByRef("phone").getStringValue(),
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
                    values: { ...signUpData },
                };

                nextState.errors.login = validate("login", signUpData.login)
                nextState.errors.password = validate("password", signUpData.password)
                nextState.errors.confirmPassword = signUpData.password === signUpData.confirmPassword ? '' : 'Passwords does not match'
                nextState.errors.firstName = validate("first_name", signUpData.firstName)
                nextState.errors.secondName = validate("second_name", signUpData.secondName)
                nextState.errors.email = validate("email", signUpData.email)
                nextState.errors.phone = validate("phone", signUpData.phone)

                this.setState(nextState);

                if (Object.values(nextState.errors).every((e) => !e)) {
                    console.log('action/signUp', signUpData);
                    authAPI.signUp(UserDto.fromSignUpUserData(signUpData))
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
            .catch(_err => {
                // Nothing to do... User is just not authorized
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

                    <h2>Sign Up</h2>
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
                        <span class="links-box__center">{{{Link href="/" text="Sign In"}}}</span>
                    </div>

                    <div class="mini-text signin-container__links-box form-double-indents">
                        <span class="links-box__center">Copyright © <a href="#">Your Website</a> 2022.</span>
                    </div>
                </div>
            </div>
        `
    }
}
