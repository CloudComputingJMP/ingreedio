/* eslint-disable max-len */
import { AnyAction } from 'redux';
import { combineEpics, ofType, StateObservable } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import services from '../../services';
import actions, { types } from '../actions';
import { RootState } from '../reducers';

const signInEpic = (
  action$: Observable<AnyAction>,
  _state$: StateObservable<RootState>,
) => action$.pipe(
  ofType(types.SIGN_IN_REQUEST),
  switchMap(({ payload: { username, password } }) => from(services.signInApi(username, password)).pipe(
    switchMap((response) => [
      actions.signInSuccess(response.data),
      actions.setUsername(username),
      actions.getUserInfoRequest(username),
    ]),
    catchError((error) => of(actions.signInFailure(error.response.status))),
  )),
);

const signUpEpic = (
  action$: Observable<AnyAction>,
  _state$: StateObservable<RootState>,
) => action$.pipe(
  ofType(types.SIGN_UP_REQUEST),
  switchMap(({
    payload: {
      username, displayName, email, password,
    },
  }) => from(services.signUpApi(username, displayName, email, password)).pipe(
    switchMap((_response) => [
      actions.signUpSuccess(),
    ]),
    catchError((error) => of(actions.signUpFailure(error.response.status))),
  )),
);

const signOutEpic = (
  action$: Observable<AnyAction>,
  _state$: StateObservable<RootState>,
) => action$.pipe(
  ofType(types.SIGN_OUT),
  switchMap(() => of(actions.clearUserData())),
);

// Combine epics
export const authEpic = combineEpics(signInEpic, signUpEpic, signOutEpic);
