import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sa-home',
  templateUrl: './sa-home.component.html',
  styleUrls: ['./sa-home.component.css']
})
export class SaHomeComponent implements OnInit {

  constructor() { }

  public supportBoxsDetails : any;
  public scrollable_list : any;

  ngOnInit() {
    this.supportBoxsDetails = this.getSupportBoxsDetail();
    this.scrollable_list = this.getScrollableListDetail();
  }

  public getSupportBoxsDetail(){
    return [
      {bt_detail : 'Users', bm_detail : 20, bbr_detail : '20 hello'},
      {bt_detail : 'Collection', bm_detail : 30, bbr_detail : '5 pending'},
      {bt_detail : 'Distribution', bm_detail : "40 person", bbr_detail : '2 remaning'},
      {bt_detail : 'Complain', bm_detail : 30, bbr_detail : '20 Resolve'}
    ]
  }

  public getScrollableListDetail(){
    return [
      {ac_id : 0, ac_name : 'Lanzone', ac_request_type : 'Request For Payment', ac_des : 'Payment done but not clear in app', ac_created_date : '2 Day Ago'},
      {ac_id : 1, ac_name : 'Balram Patidar', ac_request_type : 'Request For Bill', ac_des : 'Please Generate My Bill', ac_created_date : '4 Day Ago'},
      {ac_id : 1, ac_name : 'Anthony Porcacro', ac_request_type : 'Request For Check', ac_des : 'Please Recheck payment done already', ac_created_date : '5 Day Ago'},
      {ac_id : 1, ac_name : 'Paul', ac_request_type : 'Request For Bill', ac_des : 'Bill Generate My Bill', ac_created_date : '2 Day Ago'},
      {ac_id : 1, ac_name : 'Deepak Patidar', ac_request_type : 'Request For Bill', ac_des : 'Bill Generate My Bill', ac_created_date : '2 Day Ago'},
    ]
  }

}
