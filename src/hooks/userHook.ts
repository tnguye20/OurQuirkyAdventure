import React, { useState, useEffect } from 'react';
import { User } from '../interfaces';
import { UserDao } from '../daos';
import { useAuthValue } from '../contexts';

const useUser = () => {
    const [user, setUser] = useState<User>();
    const { authUser } = useAuthValue();

    useEffect(() => {
        const { userRef }  = new UserDao(authUser!.uid!);
        if (userRef) {
            const unsubscribe = userRef.onSnapshot((u) => {
                const data = {
                    id: u.id,
                    ...u.data()
                } as User
                setUser(data);
            });

            return () => unsubscribe();
        }
    }, []);

    return {
        user
    };
};

export default useUser;