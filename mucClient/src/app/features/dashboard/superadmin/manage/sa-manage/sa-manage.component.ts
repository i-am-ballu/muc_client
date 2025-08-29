import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sa-manage',
  templateUrl: './sa-manage.component.html',
  styleUrls: ['./sa-manage.component.css']
})
export class SaManageComponent implements OnInit {

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

  public active_tab: string = 'users'; // Default active menu

  public loadContent(menu){
    this.active_tab = menu;
    this.router.navigate(["/dashboard/sa_manage/"+menu]);
  }

}
