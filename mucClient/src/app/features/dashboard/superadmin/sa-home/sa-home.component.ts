import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from "src/app/features/services/login.service";

@Component({
  selector: 'app-sa-home',
  templateUrl: './sa-home.component.html',
  styleUrls: ['./sa-home.component.css']
})
export class SaHomeComponent implements OnInit {

  public company_id : number = 0;
  public water_department : boolean = false;

  constructor(
    private cookieService: CookieService,
    private loginService : LoginService,
  ) { }

  public supportBoxsDetails : any;


  ngOnInit() {
    this.getUserInfo((error,res) => {
      if(res){
        this.company_id = res && res.admin_id ? res.admin_id : 0;
        this.water_department = res && res.water_department ? true : false;
        this.getSuperAdminSupportDetailsBasedOnCompany((error,res1) => {
          if(res1){
            this.getSuperAdminActivityStreamBasedOnCompany((error,res2) => {
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

  public admin_count_list : any;
  public collection_count_list : any;
  public water_taken_count_list : any;
  public getSuperAdminSupportDetailsBasedOnCompany(callback: (error: any,result: any) => void){
    let body = {};
    this.loginService.getSuperAdminSupportDetailsBasedOnCompany(body).subscribe({
      next: (res: any) => {
        if(res.status){
          this.admin_count_list = res && res.data && res.data.admin_count_list && res.data.admin_count_list.length ? res.data.admin_count_list : [];
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
  public getSuperAdminActivityStreamBasedOnCompany(callback: (error: any,result: any) => void){
    let body = {}
    this.loginService.getSuperAdminActivityStreamBasedOnCompany(body).subscribe({
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
    let total_wu = this.water_taken_count_list && this.water_taken_count_list.length ? this.water_taken_count_list[0].total_water_users : 0;
    let total_cu_count = this.collection_count_list && this.collection_count_list.length ? this.collection_count_list[0].total_cu_count : 0;
    let total_cru_count = this.collection_count_list && this.collection_count_list.length ? this.collection_count_list[0].total_cru_count : 0;
    let total_adc = this.admin_count_list && this.admin_count_list.length ? this.admin_count_list[0].total_users : 0;
    let dis_key = this.water_department ? 'Cane' : 'Liters'

    return [
      {bt_detail : 'Active Users', bm_detail : total_adc},
      {bt_detail : 'Collection', bm_detail : total_cu_count + ' Users', bbr_detail : total_cru_count + ' Pending Users'},
      {bt_detail : dis_key + ' Taken', bm_detail : total_wc, bbr_detail : 'Total '+ total_wu + ' Users'},
      {bt_detail : 'Complain', bm_detail : 30, bbr_detail : '20 Resolve'}
    ]
  }
}
