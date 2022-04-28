import { Component } from '../../core';
import { UserDto } from '../../dto';
import { authAPI, userAPI } from '../../service/back';
import { Router } from '../../service/front';
import GlobalStorage from '../../service/front/GlobalStorage';
import { validate } from '../../service/front/validation'

import "../css/signin-signup.scss"

export class ProfilePage extends Component {
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
        const currentUser = GlobalStorage.getInstance().storage.user
        this.state = {
            apiStatus: '',
            values: {
                login: currentUser?.login,
                firstName: currentUser?.firstName,
                secondName: currentUser?.secondName,
                displayName: currentUser?.displayName,
                email: currentUser?.email,
                phone: currentUser?.phone,
            },
            errors: {
                login: '',
                firstName: '',
                secondName: '',
                displayName: '',
                email: '',
                phone: '',
            },
            onFocus: (e: InputEvent) => this.clearError(e, this),
            onBlur: (e: InputEvent) => this.validateInputAndSetError(e, this),
            onLogout: (e: PointerEvent) => {
                e.preventDefault()
                authAPI.logout()
                Router.getInstance().go('/')
            },
            onSubmit: () => {
                const profileData = {
                    login: this.retrieveChildByRef("login").getStringValue(),
                    firstName: this.retrieveChildByRef("firstName").getStringValue(),
                    secondName: this.retrieveChildByRef("secondName").getStringValue(),
                    displayName: this.retrieveChildByRef("displayName").getStringValue(),
                    email: this.retrieveChildByRef("email").getStringValue(),
                    phone: this.retrieveChildByRef("phone").getStringValue(),
                };

                const nextState = {
                    errors: {
                        login: '',
                        firstName: '',
                        secondName: '',
                        displayName: '',
                        email: '',
                        phone: '',
                    },
                    values: { ...profileData },
                };

                nextState.errors.login = validate("login", profileData.login)
                nextState.errors.firstName = validate("first_name", profileData.firstName)
                nextState.errors.secondName = validate("second_name", profileData.secondName)
                nextState.errors.displayName = validate("display_name", profileData.displayName)
                nextState.errors.email = validate("email", profileData.email)
                nextState.errors.phone = validate("phone", profileData.phone)

                this.setState(nextState);

                if (Object.values(nextState.errors).every((e) => !e)) {
                    console.log('action/update', profileData);
                    userAPI.update(UserDto.fromProfileData(profileData))
                        .then(res => {
                            if (!res) {
                                throw Error('The web app error - something wrong with auth')
                            }
                            const nextState = {
                                apiStatus: 'Success'
                            }
                            this.setState(nextState)
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

    protected render(): string {
        const { errors, values, apiStatus } = this.state;

        return /*html*/`
            <div class="signin-page">
                <div class="signin-page__container">
                    <div class="signin-container__logo"></div>

                    <h2>Profile</h2>
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
                                    value="${values.displayName}"
                                    ref="displayName"
                                    type="text"
                                    id="display_name"
                                    className="input-box__moving-label"
                                    label="Display Name *"
                                    onFocus=onFocusOrBlur
                                    onBlur=onFocusOrBlur
                            }}}
                            {{{
                                Label
                                    id="displayNameErrorLabel"
                                    ref="display_nameError"
                                    text="${errors.displayName}"
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


                        {{{ Button id="submit" className="form-container__button-box form-indents" text="Save" onClick=onSubmit }}}
                    </form>

                    <div class="mini-text signin-container__links-box form-half-indents">
                        <span class="links-box__center">{{{Link href="/messenger" text="<- Back to Messenger"}}}</span>
                    </div>

                    <div class="mini-text signin-container__links-box form-half-indents">
                        <span class="links-box__center">{{{Link href="/changePassword" text="Change Password"}}}</span>
                    </div>

                    <div class="mini-text signin-container__links-box form-half-indents">
                        <span class="links-box__center label__error">{{{Link href="/" onClick=onLogout text="Logout"}}}</span>
                    </div>

                    <div class="mini-text signin-container__links-box form-double-indents">
                        <span class="links-box__center">Copyright © <a href="#">Your Website</a> 2022.</span>
                    </div>
                </div>
            </div>
        `
    }
}
