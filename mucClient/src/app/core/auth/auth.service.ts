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
      admin_id : userInfo.superadmin_id ? userInfo.superadmin_id : 0,
      token : userInfo.token,
    }
    this.removeCookies();
    this.cookieService.set('user_info', '', -1, null, null, true, 'None');
    this.cookieService.set('user_info', JSON.stringify(user_obj), this.cookie_expire, null, null, true, 'None');
    this.router.navigate(['/dashboard/user_dashboard']);
  }
 // Get token
  public getToken(): string | null {
    return this.cookieService.get('token') || null;
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
