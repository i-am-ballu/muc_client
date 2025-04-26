import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  public loginUser(body){
    return true;
  }

  // Save token and user info in cookies
  public setSession(token: string, userInfo: any): void {
    this.cookieService.set('token', token);
    this.cookieService.set('user_info', JSON.stringify(userInfo));
  }
 // Get token
  public getToken(): string | null {
    return this.cookieService.get('token') || null;
  }

  // Get user info
  public getUserInfo(): any {
    const userInfo = this.cookieService.get('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Check if user is logged in
  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout (clear cookies)
  public logout(): void {
    this.cookieService.delete('token');
    this.cookieService.delete('user_info');
  }
}
