import { Component } from '../../core';
import { validate } from '../../service/validation'

import "../css/signin-signup.scss"

export class ForgotPage extends Component {
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
                email: '',
            },
            errors: {
                email: '',
            },
            onFocusOrBlur: (e: InputEvent) => this.validateControl(e),
            onSubmit: () => {
                const signInData = {
                    email: this.retrieveChildByRef("email").getStringValue(),
                };

                const nextState = {
                    errors: {
                        email: '',
                    },
                    values: { ...signInData },
                };

                nextState.errors.email = validate("email", signInData.email)

                this.setState(nextState);

                if (!nextState.errors.email) {
                    console.log('action/forgot', signInData);
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

                        {{{ Button id="submit" className="form-container__button-box form-indents" text="Send" onClick=onSubmit }}}
                    </form>

                    <div class="mini-text signin-container__links-box form-half-indents">
                        <span class="links-box__center">{{{Link href="/" text="Sign In"}}}</span>
                    </div>

                    <div class="mini-text signin-container__links-box form-double-indents">
                        <span class="links-box__center">Copyright © <a>Your Website</a> 2022.</span>
                    </div>
                </div>
            </div>
        `
    }
}
