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
      company: ['', Validators.required],
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
    this.getCountries();
  }

  public countrie_list : any;
  public getCountries(){
    this.loginService.getCountries({}).subscribe({
      next: (res: any) => {
        this.countrie_list = res && res.data && res.data.countries && res.data.countries.length ? res.data.countries : []
        console.log('res -------', res)
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
        this.state_list = res && res.data && res.data.states && res.data.states.length ? res.data.states : []
        console.log('res -------', res)
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
        this.cities_list = res && res.data && res.data.cities && res.data.cities.length ? res.data.cities : []
        console.log('res -------', res)
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
    let agree = this.registerForm.get('agree').value;
    let country = this.registerForm.get('country').value.name;
    let state = this.registerForm.get('state').value;
    let city = this.registerForm.get('city').value;
    let obj = {
      company: company,
      company_id : company && company.company_id ? company.company_id : 0,
      first_name: this.registerForm.get('first_name').value,
      last_name: this.registerForm.get('last_name').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value,
      confirmPassword: this.registerForm.get('confirmPassword').value,
      address: this.registerForm.get('address').value,
      mobile_number: this.registerForm.get('mobile_number').value,
      country: country,
      state: state,
      city: city,
      agree: agree ? agree : false,
    }

  }

}
