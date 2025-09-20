import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {

  public isLoggedIn : boolean = false;
  public isSuperadmin : boolean = false;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private authService : AuthService,
  ) { }

  ngOnInit() {
    let userInfo = this.getUserInfo();
    this.isLoggedIn = userInfo && userInfo.login ? userInfo.login : false;
    this.isSuperadmin = userInfo && userInfo.isSuperadmin ? userInfo.isSuperadmin : false;
  }

  // Get user info
  public getUserInfo(): any {
    let userInfo = this.cookieService.check('user_info') ? JSON.parse(this.cookieService.get('user_info')) : {};
    return userInfo ? userInfo : {};
  }

  public onClickSuperAdminNavigation(tab_name){
    let dashboard_path = tab_name == 'Home' ? '/dashboard/sa_dashboard' : '/dashboard/sa_manage';
    this.router.navigate([dashboard_path]);
  }

  public onClickAdminNavigation(tab_name){
    let dashboard_path = tab_name == 'Home' ? '/dashboard/ad_dashboard' : '/dashboard/ad_manage';
    this.router.navigate([dashboard_path]);
  }

  public onClickLogout(){
    this.authService.removeCookies();
    this.cookieService.set('user_info', '', -1, null, null, true, 'None');
    this.router.navigate(['/auth/login']);
  }

}
