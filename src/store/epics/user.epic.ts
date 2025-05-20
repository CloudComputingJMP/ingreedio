import { AxiosResponse } from 'axios';
import { AnyAction } from 'redux';
import { combineEpics, Epic, ofType } from 'redux-observable';
import {
  catchError, from, map, of, switchMap,
} from 'rxjs';

import { getUserInfoApi, UserInfoResponse } from '../../services/user.service';
import actions, { types } from '../actions';
import { RootState } from '../reducers';

const userInfoEpic: Epic<AnyAction, AnyAction, RootState> = (action$, _state$) => action$.pipe(
  ofType(types.GET_USER_INFO_REQUEST),
  switchMap(({ payload }) => from(getUserInfoApi(payload.username)).pipe(
    map((response: AxiosResponse<UserInfoResponse>) => actions.getUserInfoSuccess(response.data)),
    catchError((error) => of(actions.getUserInfoFailure(error.message))),
  )),
);

const logUserEpic: Epic<AnyAction, AnyAction, RootState> = (action$, _state$) => action$.pipe(
  ofType(types.LOG_USER),
  switchMap(({ payload }) => from(getUserInfoApi(payload.username)).pipe(
    map((response: AxiosResponse<UserInfoResponse>) => actions.getUserInfoSuccess(response.data)),
    catchError((error) => of(actions.getUserInfoFailure(error.message))),
  )),
);

export const userEpic = combineEpics(userInfoEpic, logUserEpic);
