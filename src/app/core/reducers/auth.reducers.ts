// auth.reducer.ts

import { Action } from '@ngrx/store';
import { AuthActions, AuthActionTypes } from '../actions/auth.action';

export interface AuthState {
  loggedIn: boolean;
  token: string | undefined;
  user: any;
  isUserLoaded: boolean;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  token: undefined,
  user: undefined,
  isUserLoaded: false,
  loading: false,
};

export function authReducer(
  state = initialAuthState,
  action: Action
): AuthState {
  switch (action.type) {
    case AuthActionTypes.Login: {
      const loginAction = action as AuthActions;
      return {
        ...state,
        loggedIn: true,
        token: (loginAction as any).payload.token,
        isUserLoaded: false,
        loading: true,
      };
    }

    case AuthActionTypes.UserRequested: {
      return {
        ...state,
        loggedIn: true,
        loading: true,
      };
    }

    case AuthActionTypes.UserLoaded: {
      const userLoadedAction = action as AuthActions;
      return {
        ...state,
        user: (userLoadedAction as any).payload.user,
        isUserLoaded: true,
        loggedIn: true,
        loading: false,
      };
    }

    case AuthActionTypes.Logout: {
      return initialAuthState;
    }

    default:
      return state;
  }
}
