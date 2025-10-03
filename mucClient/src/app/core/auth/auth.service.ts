import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) { }

  public loginUser(body){
    return true;
  }

  public days_90_ms = 90 * 24 * 60 * 60 * 1000;
  public Date_now = + new Date();
  public cookie_expire = new Date(this.Date_now + this.days_90_ms);
  // Save token and user info in cookies
  public setSessionAndNavigate(userInfo){
    let user_obj = {
      login : true,
      email : userInfo.email,
      first_name : userInfo.first_name,
      isSuperadmin : userInfo.isSuperadmin ? userInfo.isSuperadmin : 0,
      last_name : userInfo.last_name,
      admin_id : userInfo.id ? userInfo.id : 0,
      token : userInfo.token,
      refresh_token : userInfo.refresh_token,
      company_id : userInfo.company_id ? userInfo.company_id : 0,
      water_department : userInfo.water_department ? userInfo.water_department : 0,
    }
    this.removeCookies();
    this.cookieService.set('user_info', '', -1, null, null, true, 'None');
    this.cookieService.set('user_info', JSON.stringify(user_obj), this.cookie_expire, null, null, true, 'None');
    let dashboard_path = user_obj && user_obj.isSuperadmin ? '/dashboard/sa_dashboard' : '/dashboard/ad_dashboard';
    this.router.navigate([dashboard_path]);
  }
 // Get token
  public getToken(): string | null {
    let userInfo = this.getUserInfo();
    return userInfo && userInfo.token ? userInfo.token : null;
  }

  // Get user info
  public getUserInfo(): any {
    let userInfo = this.cookieService.check('user_info') ? JSON.parse(this.cookieService.get('user_info')) : {};
    return userInfo ? userInfo : {};
  }

  // Check if user is logged in
  public isLoggedIn(): boolean {
    let userInfo = this.getUserInfo();
    return userInfo && userInfo.login ? userInfo.login : false;
  }

  // Logout (clear cookies)
  public removeCookies(){
    this.cookieService.delete('user_info', ' / ', 'localhost');
  }
}
