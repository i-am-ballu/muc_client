import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from "src/app/features/services/login.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-ad-distribution',
  templateUrl: './ad-distribution.component.html',
  styleUrls: ['./ad-distribution.component.css']
})
export class AdDistributionComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private loginService : LoginService,
    private datePipe: DatePipe,
  ) { }

  public company_id : number = 0;
  public water_department : boolean = false;

  async ngOnInit() {
    const Plotly = await import('plotly.js-dist-min');
    PlotlyModule.plotlyjs = Plotly;

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
      is_superadmin : 0,
      is_range_between : 0,
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

  public processToCreateInsightGraphy() {
    if (!this.insightsWaterDetails || !this.insightsWaterDetails.length) return;

    const labels: string[] = [];
    const parents: string[] = [];
    const values: (number | null)[] = [];
    const ids: string[] = [];
    const customdata: any[] = [];
    const hovertemplates: any[] = [];

    // 1. Track which users are already added
    const addedUsers = new Map<string, { paid: number; remaining: number, logs: number }>();

    // 2. Single loop over data
    this.insightsWaterDetails.forEach(row => {
      let logs_count = 1;
      const userLabel = `${row.user_name}`;
      const waterCaneLabel = `Cane: ${row.water_cane}`

      // Add user node if not already added
      if (!addedUsers.has(userLabel)) {
        labels.push(userLabel);
        parents.push('');
        values.push(0); // sum of children
        ids.push(userLabel);
        addedUsers.set(userLabel, { paid: 0, remaining: 0, logs: 0 });
        customdata.push([0, 0, 0]);
        hovertemplates.push(
          '%{label}<br>Paid: %{customdata[0]}<br>Remaining: %{customdata[1]}<br>Logs: %{customdata[2]}<extra></extra>'
        );
      }

      const userData = addedUsers.get(userLabel)!;

      // Add water log node (always, even if water_cane = 0)
      const waterDate = row.water_log_c_date
        ? this.datePipe.transform(new Date(row.water_log_c_date), 'yyyy-MM-dd')
        : 'No Date';

      labels.push(waterCaneLabel);
      parents.push(userLabel);

      const waterValue = Number(row.paid_amount) + Number(row.remaining_amount) || 1;
      values.push(waterValue);
      ids.push(`${userLabel}-${row.water_id}`);

      customdata.push([row.paid_amount, row.remaining_amount, logs_count]);
      hovertemplates.push(
        '%{label}<br>Paid: %{customdata[0]}<br>Remaining: %{customdata[1]}<extra></extra>'
      );

      // Update user totals
      userData.paid += Number(row.paid_amount);
      userData.remaining += Number(row.remaining_amount);
      userData.logs += Number(logs_count);
    });

    // 3. Update user nodes hover with totals
    addedUsers.forEach((userData, userLabel) => {
      const userIndex = labels.indexOf(userLabel);
      if (userIndex !== -1) {
        customdata[userIndex] = [userData.paid, userData.remaining, userData.logs];
      }
    });

    const data = [{
      type: "sunburst",
      labels: labels,
      parents: parents,
      ids: ids,
      values:  values,
      outsidetextfont: {size: 20, color: "#377eb8"},
      leaf: {opacity: 0.4},
      marker: {line: {width: 2}},
      customdata : customdata,
      hovertemplate: hovertemplates,
    }];

    // 4. Build sunburst
    this.insightsGraphyDetails = {
      data: data,
      layout: {
        margin: { l: 0, r: 0, t: 30, b: 0 },
        title: { text: 'Water Payment Sunburst' },
        autosize: true,
      },
      config: {
        responsive: true   // ✅ key for responsiveness
      }
    };
    console.log('Sunburst data:', this.insightsGraphyDetails);
  }

}
