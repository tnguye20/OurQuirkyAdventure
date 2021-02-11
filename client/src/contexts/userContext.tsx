import * as React from 'react';
import { User } from '../interfaces';
import { useUser } from '../hooks';

const { createContext, useContext } = React;

export const UserContext = createContext<Record<string, User | undefined>>({});

export const UserContextProvider: React.FC = ({ children }) => {
    const { user } = useUser();

    return (
        <UserContext.Provider value={{
            user
        }}>
            { children }
        </UserContext.Provider>
    )
};

export const useUserValue = () => useContext(UserContext);