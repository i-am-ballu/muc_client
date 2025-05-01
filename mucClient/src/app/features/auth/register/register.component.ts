import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from "src/app/features/services/login.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService : LoginService,
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      company: [''],
      companyRole: [''],
      firstName: [''],
      lastName: [''],
      position: [''],
      country: [null, Validators.required],
      state: [''],
      city: [''],
      agree: [false, Validators.requiredTrue]
    });
    this.getCountries();
  }

  public countrie_list : any;
  public getCountries(){
    this.loginService.getCountries({}).subscribe({
      next: (res: any) => {
        this.countrie_list = res && res.countries && res.countries.length ? res.countries : []
        console.log('res -------', res)
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
  }

}
