import React from 'react';

interface Captcha {
    base64Img: string
    token: string
}

interface CodeUuid {
    code: string
    uuid: string
}

interface LoginParams extends CodeUuid {
    username: string
    password: string
    remember: boolean
}

interface AuthWrapperProps {
    children: React.ReactElement
    hasPermiss: string[]
}

interface LoginResponse {
    tokenName: string
    tokenValue: string
    tokenPrefix: string
}

export type {
    Captcha,
    CodeUuid,
    LoginParams,
    LoginResponse,
    AuthWrapperProps
}
