import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from "src/app/features/services/login.service";

@Component({
  selector: 'app-sa-distribution',
  templateUrl: './sa-distribution.component.html',
  styleUrls: ['./sa-distribution.component.css']
})
export class SaDistributionComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private loginService : LoginService,
    private datePipe: DatePipe,
  ) { }

  public company_id : number = 0;
  public water_department : boolean = false;

  ngOnInit() {
    this.getUserInfo((error,res) => {
      if(res){
        this.company_id = res && res.admin_id ? res.admin_id : 0;
        this.water_department = res && res.water_department ? true : false;
        this.getInsightsWaterPayment((error,res1) => {
          if(res1){
            this.processToCreateInsightGraphy();
          }
        });
      }
    });
  }

  public getUserInfo(callback: (error: any,result: any) => void){
    let userInfo = this.cookieService.check('user_info') ? JSON.parse(this.cookieService.get('user_info')) : {};
    callback(null,userInfo ? userInfo : {})
  }

  public insightsWaterDetails : any;
  public getInsightsWaterPayment(callback: (error: any,result: any) => void){
    let body = {
      company_id : this.company_id,
      is_superadmin : 1,
    }
    this.loginService.getInsightsWaterPayment(body).subscribe({
      next: (res: any) => {
        if(res.status){
          this.insightsWaterDetails = res && res.data && res.data.length ? res.data : [];
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

  public insightsGraphyDetails : any;
  public processToCreateInsightGraphy(){
    if(this.insightsWaterDetails && this.insightsWaterDetails.length){
      const labels = [];
      const parents = [];
      const values = [];
      const colors = [];

      this.insightsWaterDetails.forEach(row => {
        let water_log_c_date = row && row.water_log_c_date ? row.water_log_c_date : new Date();
        water_log_c_date = this.datePipe.transform(water_log_c_date, 'yyyy-MM-dd');
        const userLabel = `${row.user_name} (ID: ${row.user_id})`;
        if (!labels.includes(userLabel)) {
          labels.push(userLabel);
          parents.push('');
          values.push(0);
          colors.push('lightblue'); // user node color
        }

        const waterLabel = `${water_log_c_date} | Cane: ${row.water_cane} | Paid: ${row.paid_amount} | Remaining: ${row.remaining_amount}`;
        labels.push(waterLabel);
        parents.push(userLabel);
        values.push(row.remaining_amount); // Or row.paid_amount
        colors.push(row.payment_status === 'Paid' ? 'green' : 'red');
      });

      this.insightsGraphyDetails = {
        data: [{
          type: "sunburst",
          labels: labels,
          parents: parents,
          values: values,
          marker: { colors: colors },
          branchvalues: 'total'
        }],
        layout: { margin: { l: 0, r: 0, t: 30, b: 0 }, title: 'Water Payment Sunburst' }
      };
      console.log(this.insightsGraphyDetails)
    }
  }

}
