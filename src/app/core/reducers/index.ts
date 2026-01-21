// NGRX
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { environment } from '../../../environments/environment';
import { AuthState, authReducer } from './auth.reducers';

export interface AppState {
	router: RouterReducerState;
	auth: AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
	router: routerReducer,
	auth: authReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
