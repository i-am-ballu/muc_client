import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginService } from "src/app/features/services/login.service";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loginService : LoginService,
    private router: Router,
    private cookieService: CookieService,
  ){
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/dashboard/user_dashboard']);
    }
  }

  public loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  public submitted :boolean = false;
  public onSubmit(){
    this.submitted = true;

    if (this.loginForm.invalid) return;

    this.loginService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.authService.setSessionAndNavigate(res);
      },
      error: err => {
        console.log('Invalid credentials')
      }
    });
  }

}
