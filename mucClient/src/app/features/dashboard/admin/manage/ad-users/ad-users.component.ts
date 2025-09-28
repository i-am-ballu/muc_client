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
          this.water_department = res && res.water_department ? true : false;
          this.getUserBasedOnUserId((error,res) => {});
        }
    });
  }

  public water_department : boolean = false;
  // Get user info
  public getUserInfo(callback: (error: any,result: any) => void){
    let userInfo = this.cookieService.check('user_info') ? JSON.parse(this.cookieService.get('user_info')) : {};
    callback(null,userInfo ? userInfo : {})
  }

  public user_details : any[] = [];
  public getUserBasedOnUserId(callback: (error: any,result: any) => void){
    let body = {
      company_id : this.company_id,
      user_id : this.user_id,
    }
    this.loginService.getUserDetailsBasedOnUserId(body).subscribe({
      next: (res: any) => {
        this.user_details = res && res.data && res.data.length ? res.data : [];
        this.patchUserDetails(this.user_details);
        callback(null, res);
      },
      error: err => {
        callback(err, null);
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
    let log_created_on = user && user.log_created_on ? user.log_created_on : new Date();
    log_created_on = this.datePipe.transform(log_created_on, 'yyyy-MM-dd');

    let last_payment_date = user && user.last_payment_date ? user.last_payment_date : new Date();
    last_payment_date = this.datePipe.transform(log_created_on, 'yyyy-MM-dd');

    return this.fb.group({
      water_id: [user && user.water_id ? user.water_id : 0, [Validators.required]],
      distribution_id: [user && user.distribution_id ? user.distribution_id : 0, [Validators.required]],
      user_name: [{value : user && user.user_name ? user.user_name : '', disabled: true}, [Validators.required]],
      liters: [
        {value : user && user.liters ? user.liters : 0, disabled: true},
        this.water_department ? [] : [Validators.required]
      ],
      water_cane: [
        {value : user && user.water_cane ? user.water_cane : 0, disabled: true},
        this.water_department ? [Validators.required] : []
      ],
      payment_status: [{value : user && user.payment_status ? user.payment_status : '', disabled: true}, [Validators.required]],
      paid_amount : [{value : user && user.paid_amount ? user.paid_amount : 0, disabled: true}, [Validators.required]],
      log_created_on:[{ value: log_created_on, disabled: true }],
      last_payment_date:[{ value: last_payment_date, disabled: true }]
    });
  }

  public patchUserDetails(userList: any[]) {
    this.users.clear(); // clear existing controls
    userList.forEach(user => {
      this.users.push(this.createUser(user));
    });
  }

  public
  public isOpenConfirmation : boolean = false;
  public modalOptions : any = {};

  public onClickPay(){
    this.getPendingPayments((error,res) => {
      if(res){
        if(parseInt(this.total_pending_amount)){
          let modalOptions = {
            header : true,
            headerText : "Confirmation Pay ?",
            crossButton : false,
            body : true,
            bodyText : this.total_pending_amount,
            warning : false,
            warningText : "",
            footer : true,
            cancelButtonText : 'Cancel',
            saveButtonText : 'Save'
          }
          this.modalOptions = modalOptions
          this.isOpenConfirmation = true;
        }else{
          console.log('no Amount is pending');
        }
      }else{
        console.log('error -------- ', error);
      }
    });
  }

  public total_pending_amount : any = 0;
  public getPendingPayments(callback: (error: any,result: any) => void){
    let body = {
      company_id : this.company_id,
      user_id : this.user_id,
    }
    this.loginService.getPendingPayments(body).subscribe({
      next: (res: any) => {
        this.total_pending_amount = res && res.data && res.data.total_pending_amount ? res.data.total_pending_amount : 0;
        callback(null, res);
      },
      error: err => {
        callback(err, null);
      }
    });
  }

  public callMucSaveMethod(value){
    if(parseInt(this.total_pending_amount)){
      let body = {
        company_id : this.company_id,
        user_id : this.user_id,
        total_pending_amount : parseInt(this.total_pending_amount)
      }
      this.loginService.upsertPendingPayment(body).subscribe({
        next: (res: any) => {
          if(res.status){
            this.getUserBasedOnUserId((error1,res1) => {
              if(res1.status){
                this.getPendingPayments((error2,res2) => {
                  if(res2.status){
                    this.refreshRequiredVariables();
                  }else{
                    console.log(error2);
                  }
                });
              }else{
                console.log(error1);
              }
            });
          }else{
            console.log(Error);
          }
        },
        error: err => {
          console.log(err);
        }
      });

    }
  }

  public callMucCancelMethod(){
    this.refreshRequiredVariables();
  }

  public callMucCrossMethod(){
    this.refreshRequiredVariables();
  }

  public refreshRequiredVariables(){
    this.isOpenConfirmation = false;
    this.modalOptions = {}
  }

}
