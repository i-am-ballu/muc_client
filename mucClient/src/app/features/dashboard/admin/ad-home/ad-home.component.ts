import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from "src/app/features/services/login.service";

@Component({
  selector: 'app-ad-home',
  templateUrl: './ad-home.component.html',
  styleUrls: ['./ad-home.component.css']
})
export class AdHomeComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private loginService : LoginService,
  ) { }

  public company_id : number = 0;
  public user_id : number = 0;
  public water_department : boolean = false;
  public supportBoxsDetails : any;

  ngOnInit() {
    this.getUserInfo((error,res) => {
      if(res){
        this.company_id = res && res.company_id ? res.company_id : 0;
        this.user_id = res && res.admin_id ? res.admin_id : 0;
        this.water_department = res && res.water_department ? true : false;
        this.getAdminSupportDetailsBasedOnCompany((error,res1) => {
          if(res1){
            this.getAdminActivityStreamBasedOnCompany((error,res2) => {
              if(res2){
                this.supportBoxsDetails = this.getSupportBoxsDetail();
              }
            });
          }
        });
      }
    });
  }

  public getUserInfo(callback: (error: any,result: any) => void){
    let userInfo = this.cookieService.check('user_info') ? JSON.parse(this.cookieService.get('user_info')) : {};
    callback(null,userInfo ? userInfo : {})
  }

  public collection_count_list : any;
  public water_taken_count_list : any;
  public getAdminSupportDetailsBasedOnCompany(callback: (error: any,result: any) => void){
    let body = {
      company_id : this.company_id,
      user_id : this.user_id,

    }
    this.loginService.getAdminSupportDetailsBasedOnCompany(body).subscribe({
      next: (res: any) => {
        if(res.status){
          this.collection_count_list = res && res.data && res.data.collection_count_list && res.data.collection_count_list.length ? res.data.collection_count_list : [];
          this.water_taken_count_list = res && res.data && res.data.water_taken_count_list && res.data.water_taken_count_list.length ? res.data.water_taken_count_list : [];
          callback(null, res);
        }else{
          callback(Error, null);
        }
      },
      error: err => {
        callback(err, null);
      }
    });
  }

  public activityStreamScrollableList : any;
  public getAdminActivityStreamBasedOnCompany(callback: (error: any,result: any) => void){
    let body = {
      company_id : this.company_id,
      user_id : this.user_id,
    }
    this.loginService.getAdminActivityStreamBasedOnCompany(body).subscribe({
      next: (res: any) => {
        if(res.status){
          this.activityStreamScrollableList = res && res.data && res.data.length ? res.data : [];
          callback(null, res);
        }else{
          callback(Error, null);
        }
      },
      error: err => {
        callback(err, null);
      }
    });
  }

  public getSupportBoxsDetail(){
    let total_wc = this.water_taken_count_list && this.water_taken_count_list.length ? this.water_taken_count_list[0].total_water_cane : 0;
    let total_days = this.water_taken_count_list && this.water_taken_count_list.length ? this.water_taken_count_list[0].total_days : 0;
    let remaining_days = this.water_taken_count_list && this.water_taken_count_list.length ? this.water_taken_count_list[0].remaining_days : 0;
    let total_paid_amount = this.collection_count_list && this.collection_count_list.length ? this.collection_count_list[0].total_paid_amount : 0;
    let total_pending_amount = this.collection_count_list && this.collection_count_list.length ? this.collection_count_list[0].total_pending_amount : 0;
    let dis_key = this.water_department ? 'Cane' : 'Liters'
    return [
      // {bt_detail : 'Users', bm_detail : 1, bbr_detail : 'active'},
      {bt_detail : dis_key + ' Taken', bm_detail : "Last " + total_days + " Days " + total_wc, bbr_detail : remaining_days + ' day remaning'},
      {bt_detail : 'Payment', bm_detail : total_paid_amount + " Paid", bbr_detail : total_pending_amount + ' remaning'}
    ]
  }
}
