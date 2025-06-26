'use client';

import Context, { UserData } from './Context';
import CryptoJS from 'crypto-js';

import cookies from 'js-cookie';

import { useEffect, useState } from 'react';
import { requestAuth } from '../config/request';

export function Provider({ children }: { children: React.ReactNode }) {
    const [dataUser, setDataUser] = useState<UserData>({});

    const fetchAuth = async () => {
        const res = await requestAuth();
        const bytes = CryptoJS.AES.decrypt(res.auth, process.env.NEXT_PUBLIC_SECRET_CRYPTO || '');
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        const user = JSON.parse(originalText);
        setDataUser(user);
    };

    useEffect(() => {
        const token = cookies.get('logged');
        if (!token) {
            return;
        }
        fetchAuth();
    }, []);

    return (
        <Context.Provider
            value={{
                dataUser,
                fetchAuth,
            }}
        >
            {children}
        </Context.Provider>
    );
}
