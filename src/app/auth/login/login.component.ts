import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/reducers';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { Login } from '../../core/actions/auth.action';

@Component({
	selector: 'app-login',
	imports: [CommonModule, FormsModule, InputTextModule, FloatLabelModule, PasswordModule, ButtonModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	loading: boolean = false
	constructor(private service: AuthService, private store: Store<AppState>,
		private router: Router, private tokenService: TokenService) { }

	submit(form: NgForm) {
		if (!form.valid) {
			return;
		}
		
		this.loading = true
		this.service.login(form.value).then((res: any) => {
			this.store.dispatch(new Login({ token: res.access_token }));
		}).then(() => {
			this.loading = false
			setTimeout(() => {
				this.router.navigate(['/']);	
			}, 2000);
		}).catch(() => {
			this.loading = false
		})
	}
}
