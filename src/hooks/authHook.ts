import React, { useState, useEffect } from 'react';
import { auth } from '../lib';
import { AuthToken } from '../interfaces';

const useAuth = () => {
    const uid = localStorage.getItem('uid');
    const idToken = localStorage.getItem('idToken');

    const authToken = new AuthToken(uid, idToken);
    const [authUser, setAuthUser] = useState<AuthToken>(authToken);
    
    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged(async (user) => {
           if(user) {
                const idToken = await user.getIdToken();
                localStorage.setItem('uid', user.uid);
                localStorage.setItem('idToken', idToken);

                authUser.uid = user.uid;
                authUser.idToken = idToken;
                setAuthUser(authUser);
           }
        });
    });
    
    return {
        authUser
    };
};

export default useAuth;