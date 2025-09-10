import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ad-manage',
  templateUrl: './ad-manage.component.html',
  styleUrls: ['./ad-manage.component.css']
})
export class AdManageComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){
    this.route.firstChild.url.subscribe(urlSeg => {
      this.active_tab = urlSeg && urlSeg[0] && urlSeg[0].path ? urlSeg[0].path : '';
    });
  }

  ngOnInit() {
  }

  public active_tab: string = 'payment_details'; // Default active menu

  public loadContent(menu){
    this.active_tab = menu;
    this.router.navigate(["/dashboard/ad_manage/"+menu]);
  }

}
