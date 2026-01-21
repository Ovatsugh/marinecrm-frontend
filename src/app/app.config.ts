import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import { MyPreset } from './myTheme';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { reducers, metaReducers } from './core/reducers';
import { authReducer } from './core/reducers/auth.reducers';
import { AuthEffects } from './core/effects/auth.effect';
import { InterceptService } from './services/intercept.service';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled',
			}),
			withEnabledBlockingInitialNavigation()
		),
		provideHttpClient(withInterceptorsFromDi()),
		provideAnimationsAsync(),
		providePrimeNG({
			theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } },
		}),
		provideStore(reducers, { metaReducers }),
		provideEffects([AuthEffects]),
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true,
		},
		provideToastr({
			timeOut: 3000,
			positionClass: 'toast-top-right',
			preventDuplicates: true,
		}),
		// provideEnvironmentNgxMask(),
		// provideEnvironmentNgxCurrency({
		// 	align: 'left',
		// 	allowNegative: true,
		// 	allowZero: true,
		// 	decimal: ',',
		// 	precision: 2,
		// 	prefix: 'R$ ',
		// 	suffix: '',
		// 	thousands: '.',
		// 	nullable: true,
		// 	min: null,
		// 	max: null,
		// 	inputMode: NgxCurrencyInputMode.Financial,
		// }),
		// importProvidersFrom(
		// 	StoreModule.forRoot(reducers, { metaReducers }),
		// 	StoreModule.forFeature('auth', authReducer),
		// 	EffectsModule.forRoot([AuthEffects])
		// ),

		// provideServiceWorker('ngsw-worker.js', {
		// 	enabled: !isDevMode(),
		// 	registrationStrategy: 'registerWhenStable:30000',
		// }),
	],
};
