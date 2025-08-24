import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sa-manage',
  templateUrl: './sa-manage.component.html',
  styleUrls: ['./sa-manage.component.css']
})
export class SaManageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public selectedMenu: string = 'Users'; // Default active menu
  public loadContent(menu){
    this.selectedMenu = menu;
  }

}
