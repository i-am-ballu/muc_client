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
      company: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, Validators.required],
      address:['', Validators.required],
      mobile_number:['', Validators.required],
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

  public state_list : any;
  public selected_country : any;
  public onChangeLocation(event){
    this.selected_country = event;
    let obj = {
      country : this.selected_country,
    }
    this.loginService.getStates(obj).subscribe({
      next: (res: any) => {
        this.state_list = res && res.states && res.states.length ? res.states : []
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
    this.selected_cities = event.name;
    let obj = {
      country : this.selected_country,
      state : this.selected_cities,
    }
    this.loginService.getCities(obj).subscribe({
      next: (res: any) => {
        this.cities_list = res && res.cities && res.cities.length ? res.cities : []
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

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
  }

}
