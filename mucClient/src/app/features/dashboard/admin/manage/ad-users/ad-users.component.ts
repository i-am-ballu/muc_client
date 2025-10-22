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
          this.getYearMonthListBasedOnUserId();
        }
    });
  }

  public water_department : boolean = false;
  // Get user info
  public getUserInfo(callback: (error: any,result: any) => void){
    let userInfo = this.cookieService.check('user_info') ? JSON.parse(this.cookieService.get('user_info')) : {};
    callback(null,userInfo ? userInfo : {})
  }

  public isVisibleYearDetails : boolean = false;
  public year_month_details : any[] = [];
  public getYearMonthListBasedOnUserId(){
    let body = {
      user_id : this.user_id,
    }
    this.loginService.getYearMonthListBasedOnUserId(body).subscribe({
      next: (res: any) => {
        this.isVisibleYearDetails = true;
        let year_month_details = res && res.data && res.data.length ? res.data : [];
        this.initializationYearMonthList(year_month_details);
        console.log('res -------', res)
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  public initializationYearMonthList(year_month_details){
    const grouped = year_month_details && year_month_details.length ? _.groupBy(year_month_details, 'year') : [];
    this.year_month_details = _.map(grouped, (months, year) => ({
      year: parseInt(year),
      months: months.map(m => ({ value: m.month_value, label: m.month_label }))
    }));
  }

  public selectedYear: number | null = null;
  public selectedMonth: string | null = null;

  public onYearClick(year: number) {
    this.selectedYear = this.selectedYear === year ? null : year;
    this.selectedMonth = null;
    this.user_details = [];
    this.isVisibleUserDetails = false;
  }

  public getMonthsByYear(year: number) {
    const yearObj = this.year_month_details.find(y => y.year === year);
    return yearObj ? yearObj.months : [];
  }

  public select_month_name : any;
  public onMonthClick(year: number, monthValue: string, label: string) {
    this.selectedMonth = this.selectedMonth === monthValue ? null : monthValue;
    this.select_month_name = label;
    this.isVisibleUserDetails = false;
    this.user_details = [];
    this.getUserBasedOnUserId((error,res) => {});
  }

  public getMonthStartEndTimestamps(monthValue: string) {
    // Parse the month and year
    const [year, month] = monthValue.split('-').map(Number);

    // Start of month (1st day, midnight)
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);

    // End of month (last day, 23:59:59.999)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return {
      startDate: startDate.getTime(), // bigint-like timestamp
      endDate: endDate.getTime()
    };
  }

  public user_details : any[] = [];
  public isVisibleUserDetails : boolean = false;

  public getUserBasedOnUserId(callback: (error: any,result: any) => void){
    let sd_obj = this.getMonthStartEndTimestamps(this.selectedMonth);
    let body = {
      user_id : this.user_id,
      start_date : sd_obj && sd_obj.startDate ? sd_obj.startDate : 0,
      end_date : sd_obj && sd_obj.endDate ? sd_obj.endDate : 0,
      is_range_between : 1,
    }
    this.loginService.getUserDetailsBasedOnUserId(body).subscribe({
      next: (res: any) => {
        this.isVisibleUserDetails = true;
        this.user_details = res && res.data && res.data.length ? res.data : [];
        this.patchUserDetails(this.user_details);
        callback(null, res);
      },
      error: err => {
        callback(err, null);
      }
    });
  }

  public resetRequiredVariable(){
    this.isVisibleUserDetails = false;
    this.user_details = [];
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
      month_name : this.select_month_name,
    };
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
        total_pending_amount : parseInt(this.total_pending_amount),
        month_name : this.select_month_name,
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
