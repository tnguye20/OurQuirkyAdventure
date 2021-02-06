import * as React from 'react';
import { useAuthValue } from '../../contexts';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from '../../shared/config';

export const UnAuthRoute: React.FC = ({ children, ...rest }) => {
    const { authUser } = useAuthValue();
    return (
        <Route
            { ...rest }
            render = {
                ({ location }) => (
                    authUser === null ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: ROUTES.SLIDE,
                                state: { from: location }
                            }}
                        />
                    )
                )
            }
        />
    );
};