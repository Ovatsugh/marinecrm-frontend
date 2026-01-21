import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { AuthComponent } from './auth/auth.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ProductsComponent } from './pages/products/products.component';
import { SalesComponent } from './pages/sales/sales.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		component: AppLayout,
		canActivate: [AuthGuard],
		children: [
			{ path: '', component: ClientsComponent },
			{ path: 'produtos', component: ProductsComponent },
			{ path: 'vendas', component: SalesComponent },
			{ path: 'kanban', component: KanbanComponent },

			//   {
			//     path: 'uikit',
			//     loadChildren: () => import('./app/pages/uikit/uikit.routes'),
			//   },
			//   { path: 'documentation', component: Documentation },
			//   { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
		],
	},

	{
		path: 'auth',
		component: AuthComponent,
		children: [
			{ path: '', loadComponent: () => import('./auth/login/login.component').then((c) => c.LoginComponent) },
			//   {
			//     path: 'uikit',
			//     loadChildren: () => import('./app/pages/uikit/uikit.routes'),
			//   },
			//   { path: 'documentation', component: Documentation },
			//   { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
		],
	},
];
