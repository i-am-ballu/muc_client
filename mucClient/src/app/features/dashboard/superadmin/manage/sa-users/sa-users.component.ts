import { Component, OnInit } from '@angular/core';
import { LoginService } from "src/app/features/services/login.service";

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

  public isVisibleUserDetails : boolean = false;
  public onClickAbleRow(value){
    this.isVisibleUserDetails = true;
    console.log(value)
  }

  constructor(
    private loginService : LoginService,
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

}
