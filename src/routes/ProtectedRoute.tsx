import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { RootState } from '../store/reducers';
import { ROUTES } from './routes';

export enum LoginState {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
  LOGGED_IN_MOD = 'LOGGED_IN_MOD',
}

type ProtectedRouteProps = {
  expectedLoginState?: LoginState;
  redirectPath?: ROUTES;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  expectedLoginState = LoginState.LOGGED_IN,
  redirectPath = ROUTES.HOME,
  children,
}: ProtectedRouteProps): React.ReactElement => {
  const {
    isAuthenticated, loginSuccessful, signupSuccessful, isMod,
  } = useSelector((state: RootState) => state.auth);

  // do not enforce route protection when login/registration did not finish
  if (loginSuccessful !== null || signupSuccessful !== null) return children;

  if (expectedLoginState === LoginState.LOGGED_IN && !isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (expectedLoginState === LoginState.LOGGED_IN_MOD) {
    if (!isAuthenticated || !isMod) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};
