import * as React from 'react';
import { Dispatch } from 'react';
import { useAuth } from '../hooks';
import { AuthToken } from '../interfaces';

const { createContext, useContext } = React;

interface AuthContextValue {
    authUser: AuthToken | undefined,
    setAuthUser: Dispatch<React.SetStateAction<AuthToken>> | undefined
}

export const AuthContext = createContext<AuthContextValue>({
    authUser: undefined,
    setAuthUser: undefined
});
 
export const AuthContextProvider: React.FC = ({ children }) => {
    const { authUser, setAuthUser } = useAuth();

    return (
        <AuthContext.Provider value={{
            authUser,
            setAuthUser
        }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuthValue = () => useContext(AuthContext);