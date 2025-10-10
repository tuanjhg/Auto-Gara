import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '@df_services/login.service';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';
import { LoginSchema } from '@df_validators/formSchemas/login.schema';
import { LoginResponse, UserInfoToken } from 'app/_models/login.model';
import { LoadingService } from 'app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    submitted = false;
    serverMessage: string;
    isSubmitting = false;
    constructor(
        private formbuilder: FormBuilder,
        private router: Router,
        private loginService: LoginService,
        public loadingService: LoadingService,
        private toastr: ToastrService,
    ) {}

    ngOnInit(): void {
        this.loginForm = buildFormGroup(this.formbuilder, LoginSchema);
    }

    ngOnDestroy(): void {}

    onSubmit(): void {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.loadingService.show();
        const { email, password } = this.loginForm.value;
        this.serverMessage = '';

        this.loginService.login(email, password).subscribe({
            next: (response: LoginResponse) => {
                const userInfo: UserInfoToken = {
                    id: response.id,
                    role: response.role,
                    email: response.email,
                };
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                localStorage.setItem('user', JSON.stringify(userInfo));
                this.loadingService.hide();
                this.submitted = false;
                this.router.navigate(['/dashboard']);
            },
            error: (error) => {
                this.loadingService.hide();
                this.submitted = false;
                const msg = error.error.errors.join('\n');
                this.toastr.error(msg, 'failed!');
            },
        });
    }
}
