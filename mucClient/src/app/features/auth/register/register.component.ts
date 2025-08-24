import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      company: [null, Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      address:['', Validators.required],
      mobile_number:['', Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, Validators.required],
      agree: [false, Validators.requiredTrue]
    });
    this.getSuperAdminCompanyDetails();
    this.getCountries();
  }

  public company_list : any;
  public getSuperAdminCompanyDetails(){
    this.loginService.getSuperAdminDetails({}).subscribe({
      next: (res: any) => {
        this.company_list = res && res.data && res.data.company_list && res.data.company_list.length ? res.data.company_list : [];
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  public countrie_list : any;
  public getCountries(){
    this.loginService.getCountries({}).subscribe({
      next: (res: any) => {
        this.countrie_list = res && res.data && res.data.countries && res.data.countries.length ? res.data.countries : [];
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  public state_list : any;
  public selected_country : any;
  public onChangeLocation(event){
    this.selected_country = event;
    let obj = {
      country_code : this.selected_country.iso2,
    }
    this.loginService.getStates(obj).subscribe({
      next: (res: any) => {
        this.state_list = res && res.data && res.data.states && res.data.states.length ? res.data.states : [];
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  public cities_list : any;
  public selected_cities : any;
  public onChangeState(event){
    this.selected_cities = event;
    let obj = {
      country_code : this.selected_country.iso2,
      state_code : this.selected_cities.iso2,
    }
    this.loginService.getCities(obj).subscribe({
      next: (res: any) => {
        this.cities_list = res && res.data && res.data.cities && res.data.cities.length ? res.data.cities : [];
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  public onChangeCity(event){
    console.log('event', event)
  }

  public submitted : boolean = false;
  public onSubmitRegister(){
    this.submitted = true;
    if(this.registerForm.invalid){
      return;
    }
    let company = this.registerForm.get('company').value;
    let first_name = this.registerForm && this.registerForm.get('first_name') ? this.registerForm.get('first_name').value : '';
    let last_name = this.registerForm && this.registerForm.get('last_name') ? this.registerForm.get('last_name').value : '';
    let email = this.registerForm && this.registerForm.get('email') ? this.registerForm.get('email').value : '';
    let password = this.registerForm && this.registerForm.get('password') ? this.registerForm.get('password').value : '';
    let confirmPassword = this.registerForm && this.registerForm.get('confirmPassword') ? this.registerForm.get('confirmPassword').value : '';
    let address = this.registerForm && this.registerForm.get('address') ? this.registerForm.get('address').value : '';
    let mobile_number = this.registerForm && this.registerForm.get('mobile_number') ? this.registerForm.get('mobile_number').value : '';

    let agree = this.registerForm.get('agree').value;
    let country = this.registerForm.get('country').value.name;
    let state = this.registerForm.get('state').value.name;
    let city = this.registerForm.get('city').value.name;
    let obj = {
      company_id : company && company.superadmin_id ? company.superadmin_id : 0,
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      address: address,
      mobile_number: mobile_number,
      country: country,
      state: state,
      city: city,
      agree: agree ? agree : false,
    }

    this.loginService.upsertUser(obj).subscribe({
      next: (res: any) => {
        this.router.navigate(["/auth/login"]);
      },
      error: err => {
        let error_message = err && err.error && err.error.data && err.error.data.message ? err.error.data.message : err && err.error ? err.error.message : "";
        console.log(error_message);
      }
    });
  }

  public onClickSignIn(){
    this.router.navigate(["/auth/login"]);
  }

}
