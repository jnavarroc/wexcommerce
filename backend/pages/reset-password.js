import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { strings as commonStrings } from '../lang/common';
import { strings as cpStrings } from '../lang/change-password';
import { strings as fpStrings } from '../lang/forgot-password';
import { strings as activateStrings } from '../lang/activate';
import { strings as masterStrings } from '../lang/master';
import NoMatch from '../components/NoMatch';
import {
    Input,
    InputLabel,
    FormControl,
    FormHelperText,
    Button,
    Paper
} from '@mui/material';
import * as Helper from '../common/Helper';
import { useRouter } from "next/router";
import Header from '../components/Header';
import Link from 'next/link';
import SettingService from '../services/SettingService';

import styles from '../styles/reset-password.module.css';

export default function ResetUserPassword({
    _noMatch,
    _userId,
    _email,
    _token,
    _user,
    _signout,
    _resend,
    _language
}) {
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);

    useEffect(() => {
        if (_language) {
            Helper.setLanguage(commonStrings, _language);
            Helper.setLanguage(cpStrings, _language);
            Helper.setLanguage(fpStrings, _language);
        }
    }, [_language]);

    useEffect(() => {
        if (_signout) {
            UserService.signout(false);
        }
    }, [_signout]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);

        if (!e.target.value) {
            setPasswordLengthError(true);
        }
    };

    const handlePasswordBlur = (e) => {
        if (password && password.length < 6) {
            setPasswordLengthError(true);
            setConfirmPasswordError(false);
        } else {
            setPasswordLengthError(false);
            setConfirmPasswordError(false);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);

        if (!e.target.value) {
            setConfirmPasswordError(false);
        }
    };

    const handleConfirmPasswordBlur = (e) => {
        if (password && confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError(true);
        } else {
            setConfirmPasswordError(false);
        }
    };

    const handleConfirmPasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            if (password.length < 6) {
                setPasswordLengthError(true);
                setConfirmPasswordError(false);
                return;
            } else {
                setConfirmPasswordError(false);
            }

            if (password !== confirmPassword) {
                setConfirmPasswordError(true);
                return;
            } else {
                setConfirmPasswordError(false);
            }

            const data = { userId: _userId, token: _token, password };

            const status = await UserService.activate(data)

            if (status === 200) {
                const res = await UserService.signin({ email: _email, password })

                if (res.status === 200) {
                    const status = await UserService.deleteTokens(_userId);

                    if (status === 200) {
                        router.replace('/');
                    } else {
                        Helper.error();
                    }
                } else {
                    Helper.error();
                }

            } else {
                Helper.error();
            }
        } catch (err) {
            Helper.error();
        }
    };

    return <>
        <Header user={_user} hideSearch hideSignIn />
        <div className='content'>
            {_resend && _email &&
                <div className={styles.resend}>
                    <Paper className={styles.resendForm} elevation={10}>
                        <h1>{fpStrings.RESET_PASSWORD_HEADING}</h1>
                        <div className={styles.resendFormContent}>
                            <label>{activateStrings.TOKEN_EXPIRED}</label>
                            <Button
                                type="button"
                                variant="contained"
                                size="small"
                                className={`btn-primary ${styles.btnResend}`}
                                onClick={async () => {
                                    try {
                                        const status = await UserService.resend(_email, true);

                                        if (status === 200) {
                                            Helper.info(commonStrings.RESET_PASSWORD_EMAIL_SENT);
                                        } else {
                                            Helper.error();
                                        }
                                    } catch (err) {
                                        Helper.error();
                                    }
                                }}
                            >{masterStrings.RESEND}</Button>
                            <p><Link href='/'>{commonStrings.GO_TO_HOME}</Link></p>
                        </div>
                    </Paper>
                </div>
            }

            {_userId && _email && _token && !_user && !_noMatch && !_resend &&
                <div className={styles.resetUserPassword}>
                    <Paper className={styles.resetUserPasswordForm} elevation={10}>
                        <h1>{fpStrings.RESET_PASSWORD_HEADING}</h1>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel className='required' error={passwordLengthError}>
                                    {cpStrings.NEW_PASSWORD}
                                </InputLabel>
                                <Input
                                    onChange={handlePasswordChange}
                                    onBlur={handlePasswordBlur}
                                    type='password'
                                    error={passwordLengthError}
                                    required
                                />
                                <FormHelperText
                                    error={passwordLengthError}
                                >
                                    {(passwordLengthError && commonStrings.PASSWORD_ERROR) || ''}
                                </FormHelperText>
                            </FormControl>
                            <FormControl fullWidth margin="dense" error={confirmPasswordError}>
                                <InputLabel error={confirmPasswordError} className='required'>
                                    {commonStrings.CONFIRM_PASSWORD}
                                </InputLabel>
                                <Input
                                    onChange={handleConfirmPasswordChange}
                                    onKeyDown={handleConfirmPasswordKeyDown}
                                    onBlur={handleConfirmPasswordBlur}
                                    error={confirmPasswordError}
                                    type='password'
                                    required
                                />
                                <FormHelperText
                                    error={confirmPasswordError}
                                >
                                    {(confirmPasswordError && commonStrings.PASSWORDS_DONT_MATCH) || ''}
                                </FormHelperText>
                            </FormControl>
                            <div className='buttons'>
                                <Button
                                    type="submit"
                                    className='btn-primary btn-margin btn-margin-bottom'
                                    size="small"
                                    variant='contained'
                                >
                                    {commonStrings.UPDATE}
                                </Button>
                                <Button
                                    className='btn-secondary btn-margin-bottom'
                                    size="small"
                                    variant='contained'
                                    onClick={() => {
                                        router.replace('/');
                                    }}
                                >
                                    {commonStrings.CANCEL}
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </div>
            }
            {_noMatch && <NoMatch language={_language} />}
        </div>
    </>;
}

export async function getServerSideProps(context) {
    const { u: userId, e: email, t: token } = context.query;

    let _noMatch = false, _userId = '', _email = '', _token = '',
        _user = null, isAdmin = false, _signout = false, _resend = false,
        _language = '';

    try {
        _language = await SettingService.getLanguage();

        if (userId && email && token) {
            isAdmin = await UserService.isAdmin(email);
        }

        const currentUser = UserService.getCurrentUser(context);

        if (userId && email && token) {
            if (isAdmin) {
                const status = await UserService.checkToken(userId, email, token);
                _userId = userId;
                _email = email;
                _token = token;

                if (status !== 200) {
                    _resend = true;
                }
            } else {
                _noMatch = true;
            }
        } else {
            _noMatch = true;
        }

        if (currentUser) {
            if (isAdmin) {
                let status;
                try {
                    status = await UserService.validateAccessToken(context);
                } catch (err) {
                    console.log('Unauthorized!');
                }

                if (status === 200) {
                    _user = await UserService.getUser(context, userId);

                    if (_user) {
                        _noMatch = true;
                    }
                } else {
                    _signout = true;
                }
            } else {
                _noMatch = true;
            }
        }
    } catch (err) {
        console.log(err);
        _noMatch = true;
    }

    return {
        props: {
            _noMatch,
            _userId,
            _email,
            _token,
            _user,
            _signout,
            _resend,
            _language
        }
    };
}