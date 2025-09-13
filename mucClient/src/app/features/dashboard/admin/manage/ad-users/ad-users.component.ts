import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from "src/app/features/services/login.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-ad-users',
  templateUrl: './ad-users.component.html',
  styleUrls: ['./ad-users.component.css']
})
export class AdUsersComponent implements OnInit {

  public company_id : number = 0;
  public user_id : number = 0;

  constructor(
    private cookieService: CookieService,
    private loginService : LoginService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.initializeUserForm();
    this.initialize();
  }

  public initialize(){
    this.getUserInfo((error,res) => {
        if(res){
          this.company_id = res && res.company_id ? res.company_id : 0;
          this.user_id = res && res.admin_id ? res.admin_id : 0;
          this.getUserBasedOnUserId();
        }
    });
  }

  // Get user info
  public getUserInfo(callback: (error: any,result: any) => void){
    let userInfo = this.cookieService.check('user_info') ? JSON.parse(this.cookieService.get('user_info')) : {};
    callback(null,userInfo ? userInfo : {})
  }

  public user_details : any[] = [];
  public getUserBasedOnUserId(){
    let body = {
      company_id : this.company_id,
      user_id : this.user_id,
    }
    this.loginService.getUserDetailsBasedOnUserId(body).subscribe({
      next: (res: any) => {
        this.user_details = res && res.data && res.data.length ? res.data : [];
        this.patchUserDetails(this.user_details);
        console.log('res -------', res)
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  public usersForm: FormGroup;

  public initializeUserForm(){
    this.usersForm = this.fb.group({
      users: this.fb.array([])
    });
  }

  // Getter for users FormArray
  get users(): FormArray {
    return this.usersForm.get('users') as FormArray;
  }

  // Create user form group
  public createUser(user: any): FormGroup {
    return this.fb.group({
      water_id: [user && user.water_id ? user.water_id : 0, [Validators.required]],
      distribution_id: [user && user.distribution_id ? user.distribution_id : 0, [Validators.required]],
      user_name: [user && user.user_name ? user.user_name : '', [Validators.required]],
      liters: [user && user.liters ? user.liters : '', [Validators.required]],
      water_cane: [user && user.water_cane ? user.water_cane : '', [Validators.required]],
      payment_status: [user && user.payment_status ? user.payment_status : '', [Validators.required]],
      paid_amount : [user && user.paid_amount ? user.paid_amount : 0, [Validators.required]],
    });
  }

  public patchUserDetails(userList: any[]) {
    this.users.clear(); // clear existing controls
    userList.forEach(user => {
      this.users.push(this.createUser(user));
    });
  }

  public onClickPay(){
    let body = {
      company_id : this.company_id,
      user_id : this.user_id,
    }
    console.log('this.users ------ ', this.users);
  }

}
