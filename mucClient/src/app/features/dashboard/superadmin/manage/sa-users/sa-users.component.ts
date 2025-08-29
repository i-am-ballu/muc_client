import { Component, OnInit } from '@angular/core';
import { LoginService } from "src/app/features/services/login.service";

@Component({
  selector: 'app-sa-users',
  templateUrl: './sa-users.component.html',
  styleUrls: ['./sa-users.component.css']
})
export class SaUsersComponent implements OnInit {


  public columnDefs = [
    { prop: 'user_id', name: 'User ID' },
    { prop: 'company_id', name: 'Company ID' },
    { prop: 'first_name', name: 'First Name' },
    { prop: 'last_name', name: 'Last Name' },
    { prop: 'full_name', name: 'Full Name' },
    { prop: 'email', name: 'Email' },
  ];
  public rowsData : any;
  public totalRecords : number = 0;
  public page : any = {
    limit: 10,     // rows per page
    count: 0,      // total records
    offset: 0      // current page index
  };

  constructor(
    private loginService : LoginService,
  ) { }

  ngOnInit() {
    this.getAllUsersBasedOnCompanyId();
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
