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
    if(!this.insightsWaterDetails || !this.insightsWaterDetails.length) return;

    interface NodeData {
      id: string;
      label: string;
      parent: string;    // '' for root
      value: number;     // numeric value used by Plotly
      paid: number;
      remaining: number;
      canes: number;
      isLeaf: boolean;
    }

    const nodeMap = new Map<string, NodeData>();

    const addNodeIfMissing = (id: string, label: string, parent: string, isLeaf = false) => {
      if (!nodeMap.has(id)) {
        nodeMap.set(id, {
          id,
          label,
          parent,
          value: 0,
          paid: 0,
          remaining: 0,
          canes: 0,
          isLeaf
        });
      }
    };

    // 1) Create nodes and accumulate leaf (month) totals
    this.insightsWaterDetails.forEach(row => {
      const userId = `user-${row.user_id}`;
      const yearId = `${userId}-${row.year}`;
      const monthId = `${yearId}-${row.month_value}`; // e.g. user-3-2025-2025-08

      const userLabel = row.user_name.replace(/\s+/g, ' ').trim();
      const yearLabel = `${row.year}`;
      const monthLabel = row.month_label;

      addNodeIfMissing(userId, userLabel, '', false);
      addNodeIfMissing(yearId, yearLabel, userId, false);
      addNodeIfMissing(monthId, monthLabel, yearId, true);

      const paid = Number(row.paid_amount) || 0;
      const remaining = Number(row.remaining_amount) || 0;
      const canes = Number(row.water_cane) || 0;

      // Choose sizing metric here. Current: total money (paid + remaining).
      // If you want sunburst size by canes, replace with: const leafValue = canes;
      const leafValue = paid + remaining;

      const monthNode = nodeMap.get(monthId)!;
      monthNode.paid += paid;
      monthNode.remaining += remaining;
      monthNode.canes += canes;
      monthNode.value += leafValue;
    });

    // 2) Aggregate upward so each parent.value = sum(children.value)
    // Sort nodes by depth (deeper nodes first) so aggregation flows upward
    const nodesArray = Array.from(nodeMap.values());
    nodesArray.sort((a, b) => b.id.split('-').length - a.id.split('-').length);

    for (const node of nodesArray) {
      if (!node.parent) continue;
      const parentNode = nodeMap.get(node.parent);
      if (!parentNode) continue;
      parentNode.paid += node.paid;
      parentNode.remaining += node.remaining;
      parentNode.canes += node.canes;
      parentNode.value += node.value;
    }

    // 3) Build arrays for Plotly (order root → users → years → months for readability)
    const sortedForPlot = Array.from(nodeMap.values()).sort((a, b) => {
      const depthA = a.id.split('-').length;
      const depthB = b.id.split('-').length;
      if (depthA !== depthB) return depthA - depthB; // shallow first
      return a.id.localeCompare(b.id);
    });

    const labels: string[] = [];
    const parents: string[] = [];
    const ids: string[] = [];
    const values: number[] = [];
    const customdata: any[] = [];

    sortedForPlot.forEach(n => {
      labels.push(n.label);
      parents.push(n.parent);         // root has ''
      ids.push(n.id);
      // Use the numeric value (parent == sum(children))
      values.push(n.value);
      // customdata: [paid, remaining, canes]
      customdata.push([n.paid, n.remaining, n.canes]);
    });

    // 4) Plotly sunburst config
    const data = [
      {
        type: 'sunburst',
        labels: labels,
        parents: parents,
        ids: ids,
        values: values,
        branchvalues: 'total', // parent value must equal sum(children) — satisfied now
        customdata: customdata,
        hovertemplate:
          '%{label}<br>Total Canes: %{customdata[2]}<br>Paid: %{customdata[0]}<br>Remaining: %{customdata[1]}<extra></extra>',
        outsidetextfont: { size: 14, color: '#377eb8' },
        leaf: { opacity: 0.6 },
        marker: { line: { width: 2 } }
      }
    ];

    this.insightsGraphyDetails = {
      data,
      layout: {
        title: { text: '💧 Water Payment Sunburst (Users → Years → Months)' },
        margin: { l: 0, r: 0, t: 40, b: 0 },
        autosize: true
      },
      config: { responsive: true }
    };
  }

}
