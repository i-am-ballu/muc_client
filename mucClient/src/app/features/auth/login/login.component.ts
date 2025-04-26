import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginService } from "src/app/features/services/login.service";
import { Router } from '@angular/router';

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
    private router: Router
  ){}

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
        let user_obj = {
          email : res.email,
          first_name : res.first_name,
          last_name : res.last_name,
          isSuperadmin : res.isSuperadmin,
          superadmin_id : res.superadmin_id,
        }
        this.authService.setSession(res.token, user_obj);
        this.router.navigate(['/dashboard/user_dashboard']);
      },
      error: err => {
        console.log('Invalid credentials')
      }
    });
  }

}
