import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from "src/app/features/services/login.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-sa-users',
  templateUrl: './sa-users.component.html',
  styleUrls: ['./sa-users.component.css']
})
export class SaUsersComponent implements OnInit {


  public columnDefs : any[] = [];

  public rowsData : any[] = [];

  public page : any = {
    limit: 10,     // rows per page
    count: 0,      // total records
    offset: 0      // current page index
  };

  public selected : any[] = [];

  public onSelect(selected){
    this.selected = [...selected];
  }

  public company_id : number = 0;
  public user_id : number = 0;

  public onClickAbleRow(value){
    let row_data = value && value.row ? value.row : {};
    this.user_id = row_data && row_data.user_id ? row_data.user_id : 0;
    this.company_id = row_data && row_data.company_id ? row_data.company_id : 0;
    this.getUserBasedOnUserId();
  }

  constructor(
    private loginService : LoginService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.columnDefs = this.processToCreateColumnDefs();
    this.getAllUsersBasedOnCompanyId();
  }

  public processToCreateColumnDefs(){
    return [
      { prop: 'full_name', name: 'User Name', clickable: true, },
      { prop: 'first_name', name: 'First Name', clickable: false, },
      { prop: 'last_name', name: 'Last Name', clickable: false, },
      { prop: 'email', name: 'Email', clickable: false, },
    ];
  }

  public getAllUsersBasedOnCompanyId(){
    this.loginService.getAllUsersBasedOnCompanyId({}).subscribe({
      next: (res: any) => {
        console.log('res -------', res.data)
        this.rowsData = res && res.data && res.data.length ? res.data : [];
        this.page['count'] = res && res.data && res.data.length ? res.data.length : 0;
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  public isVisibleUserDetails : boolean = false;
  public user_details : any[] = [];
  public getUserBasedOnUserId(){
    let body = {
      company_id : this.company_id,
      user_id : this.user_id,
    }
    this.loginService.getUserDetailsBasedOnUserId(body).subscribe({
      next: (res: any) => {
        this.isVisibleUserDetails = true;
        this.user_details = res && res.data && res.data.length ? res.data : [];
        this.initializationUserLitersForm();
        console.log('res -------', res)
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  public userLitersForm: FormGroup;

  public initializationUserLitersForm(){
    let grouped = _.groupBy(this.user_details, row => row.user_id);
    this.user_details = _.map(_.groupBy(this.user_details, 'user_id'),(rows, user_id) => {
      // Get first row for user info
      const firstRow = rows ? _.first(rows) : {};
      let last_payment_date = firstRow && firstRow.last_payment_date ? firstRow.last_payment_date : new Date();
      const processedRows = _.map(rows ,row => {
        let log_created_on = row && row.log_created_on ? row.log_created_on : new Date();
        log_created_on = this.datePipe.transform(log_created_on, 'yyyy-MM-dd');
        row.userLitersForm = this.fb.group({
          company_id: [row.company_id],
          user_id: [row.user_id],
          water_id: [row.water_id],
          liters: [row.liters, Validators.required],
          paid_amount:[{ value: row.paid_amount, disabled: true }],
          log_created_on:[{ value: log_created_on, disabled: true }]
        });
        return row;
      });
      return {
        user_id: firstRow.user_id,
        user_name: firstRow.user_name,
        last_payment_date: this.datePipe.transform(last_payment_date, 'dd MMM yyyy, h:mm:ss a'),
        open: false,
        rows: processedRows
      };
    });
  }

  public toggleRow(row) {
    row.open = !row.open;
  }

  public isSubmit : boolean = false;

  public onClickSave(){
    let rows = this.user_details && this.user_details.length ? _.flatMap(this.user_details, 'rows') : [];
    let userLitersForm = rows && rows.length ? _.map(rows,'userLitersForm') : [];
    const isValid = userLitersForm && userLitersForm.length ? _.every(userLitersForm, 'valid') : false;

    this.isSubmit = true;
    if(!isValid){
      return;
    }

    let body = _.map(userLitersForm, form => ({
      company_id: form && form.get('company_id') && form.get('company_id').value ? form.get('company_id').value : 0,
      user_id: form && form.get('user_id') && form.get('user_id').value ? form.get('user_id').value : 0,
      water_id: form && form.get('water_id') && form.get('water_id').value ? form.get('water_id').value : 0,
      liters: form && form.get('liters') && form.get('liters').value ? form.get('liters').value : 0,
      paid_amount: form && form.get('paid_amount') && form.get('paid_amount').value ? form.get('paid_amount').value : 0,
    }));

    this.loginService.upsertUserDetailsBasedOnUserId(body).subscribe({
      next: (res: any) => {
        console.log('res -------', res)
        this.getUserBasedOnUserId();
      },
      error: err => {
        console.log('error--------', err)
      }
    });

    console.log('user ------- ', payload)
  }

}
