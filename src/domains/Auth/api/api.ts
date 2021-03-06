import axios from 'utils/axios';
import errors from 'utils/errors';
import * as AuthTypes from '../types';

export async function login(username?: string, password?: string) {
    if (!username || !password) {
        throw errors.fieldError();
    }
    // check if valid
    if (!username.match(/\w+/g) || !password.match(/\w+/g)) {
        throw errors.fieldError();
    }
    return axios.post('/api/users/login', {
        username,
        password,
    });
}

export async function loginTemp(username: string) {
    if (!username.match(/\w+/g)) {
        throw errors.fieldError();
    }
    return axios.post('/api/users/login-temporary', {
        username,
    });
}

export async function forgotPassReset(
    token: string | unknown,
    form: AuthTypes.ForgotPassForm
) {
    const { password, confirmPassword } = form;

    if (!password || !confirmPassword) {
        throw errors.fieldError();
    }

    if (password !== confirmPassword) {
        throw errors.passMatch();
    }

    if (!token) {
        throw errors.missingToken();
    }

    return axios.post('/api/users/consume-password-reset-token', {
        token,
        form,
    });
}

export async function forgotPassRequest(form: AuthTypes.ForgotPassRequestForm) {
    if (!form.email) {
        throw errors.fieldError();
    }
    const match = form.email.match(/(\w+\.*)*\w+@(\w+\.)+\w+/gi);
    if (!match || match[0].length !== form.email.length) {
        throw errors.invalidEmail();
    }
    return axios.post('/api/users/request-password-reset', { form });
}

export async function register(form: AuthTypes.RegisterForm) {
    const { username, password, email, confirmPassword } = form;

    if (!username || !password || !email || !confirmPassword) {
        throw errors.fieldError();
    }

    const match = email.match(/(\w+\.*)*\w+@(\w+\.)+\w+/gi);
    if (!match || match[0].length !== email.length) {
        throw errors.invalidEmail();
    }

    if (password !== confirmPassword) {
        throw errors.passMatch();
    }
    return axios.post('/api/users/register', { form });
}

export async function verifyEmail(userId: string) {
    if (!userId) {
        throw errors.invalidInfo();
    }
    return axios.post('/api/confirm/user-email', { userId });
}
