import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '@df_services/login.service';
import { LoginResponse } from 'app/_models/login.model';
import { LoadingService } from 'app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
    private toastr: ToastrService
  ) {}

   ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+([a-zA-Z]{2,6}))$/
          )
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnDestroy(): void {
  }

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
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('role',response.role);
        this.loadingService.hide();
        this.submitted = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loadingService.hide();
        this.submitted = false;
        if (Array.isArray(error?.errors)) {
          this.serverMessage = error.errors.join(', ');
        } else if (typeof error?.errors === 'string') {
          this.serverMessage = error.errors;
        } else {
          this.serverMessage = error?.userMessage || 'Login failed. Please try again.';
        }
        this.toastr.error(this.serverMessage, 'Failed!');
      }
    });
  }
}
