import * as React from 'react';
import { useAuthValue } from '../../contexts';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from '../../shared/config';

export const AuthRoute: React.FC<any> = ({ children, ...rest }) => {
    const { authUser } = useAuthValue();
    return (
        <Route
            { ...rest }
            render = {
                ({ location }) => (
                    authUser.uid !== null ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: ROUTES.LOGIN,
                                state: { from: location }
                            }}
                        />
                    )
                )
            }
        />
    );
}