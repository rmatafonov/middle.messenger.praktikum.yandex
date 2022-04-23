import { Component } from '../../core';
import { userAPI } from '../../service/back';
import { validate } from '../../service/front/validation'

import "../css/signin-signup.scss"

export class ChangePasswordPage extends Component {
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
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            errors: {
                newPassword: '',
                confirmPassword: '',
            },
            onFocus: (e: InputEvent) => this.clearError(e, this),
            onBlur: (e: InputEvent) => this.validateInputAndSetError(e, this),
            onFocusOrBlurConfirmPassword: (e: InputEvent) => {
                const password = (this.refs['newPassword'].querySelector("input") as HTMLInputElement).value
                const confirmPassword = (e.target! as HTMLInputElement).value
                if (password !== confirmPassword) {
                    this.setChildProps("confirmPasswordError", { text: 'Passwords does not match' })
                } else {
                    this.setChildProps("confirmPasswordError", { text: '' })
                }
            },
            onSubmit: () => {
                const changePasswordData = {
                    oldPassword: this.retrieveChildByRef("oldPassword").getStringValue(),
                    newPassword: this.retrieveChildByRef("newPassword").getStringValue(),
                    confirmPassword: this.retrieveChildByRef("confirmPassword").getStringValue(),
                };

                const nextState = {
                    errors: {
                        newPassword: '',
                        confirmPassword: '',
                    },
                    values: { ...changePasswordData },
                };

                nextState.errors.newPassword = validate("password", changePasswordData.newPassword)
                nextState.errors.confirmPassword = changePasswordData.newPassword === changePasswordData.confirmPassword ? '' : 'Passwords does not match'

                this.setState(nextState);

                if (Object.values(nextState.errors).every((e) => !e)) {
                    console.log('action/signUp', changePasswordData);
                    userAPI.changePassword(changePasswordData)
                        .then(res => {
                            if (!res) {
                                throw Error('The web app error - something wrong with auth')
                            }
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

                    <h2>Change Password</h2>
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
                                    value="${values.oldPassword}"
                                    ref="oldPassword"
                                    type="password" 
                                    id="oldPassword" 
                                    className="input-box__moving-label" 
                                    label="Old Password *" 
                                    onFocus=onFocusOrBlur
                                    onBlur=onFocusOrBlur
                            }}}
                        </div>
                        <div class="form-indents">
                            {{{ Input
                                    value="${values.newPassword}"
                                    ref="newPassword"
                                    type="password" 
                                    id="newPassword" 
                                    className="input-box__moving-label" 
                                    label="New Password *" 
                                    onFocus=onFocusOrBlur
                                    onBlur=onFocusOrBlur
                            }}}
                            {{{
                                Label
                                    id="newPasswordErrorLabel"
                                    ref="newPasswordError"
                                    text="${errors.newPassword}"
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

                        {{{ Button id="submit" className="form-container__button-box form-indents" text="Save" onClick=onSubmit }}}
                    </form>

                    <div class="mini-text signin-container__links-box form-half-indents">
                        <span class="links-box__center">{{{Link href="/messenger" text="<- Back to Messenger"}}}</span>
                    </div>

                    <div class="mini-text signin-container__links-box form-half-indents">
                        <span class="links-box__center">{{{Link href="/profile" text="<- Back to Profile"}}}</span>
                    </div>

                    <div class="mini-text signin-container__links-box form-double-indents">
                        <span class="links-box__center">Copyright © <a href="#">Your Website</a> 2022.</span>
                    </div>
                </div>
            </div>
        `
    }
}
