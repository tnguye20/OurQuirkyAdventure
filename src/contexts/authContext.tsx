import * as React from 'react';
import { useAuth } from '../hooks';
import { AuthToken } from '../interfaces';

const { createContext, useContext } = React;

export const AuthContext = createContext<Record<string, AuthToken>>({});
 
export const AuthContextProvider: React.FC = ({ children }) => {
    const { authUser } = useAuth();

    return (
        <AuthContext.Provider value={{
            authUser
        }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuthValue = () => useContext(AuthContext);