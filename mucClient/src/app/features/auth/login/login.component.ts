import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
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

    // this.authService.loginUser(this.loginForm.value).subscribe({
    //   next: (res: any) => {
        // this.authService.login(res.token); // Store token
        this.router.navigate(['/dashboard/user_dashboard']);
    //   },
    //   error: err => {
    //     console.log('Invalid credentials')
    //   }
    // });
  }

}
