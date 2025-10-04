import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mucClient';
  public lastPing? : Date = null;
  public timedOut : boolean = false;
  public idleState : any = 'Not started.';
  public countdown? : number = null;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private cookieService: CookieService,
    private authService : AuthService,
    private router: Router
  ) {
    this.idle.setIdle(environment.idle_time);
    this.idle.setTimeout(5);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
      console.log(this.idleState);
      this.idleModal();
      this.isOpenConfirmation = true;
    });

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      this.reset();
    });

    this.idle.onTimeoutWarning.subscribe((countdown: number) => {
      this.idleState = `You will time out in ${countdown} seconds!`;
      this.countdown = countdown;
      console.log(this.idleState);
      this.idleModal();
      this.isOpenConfirmation = true;
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Your Session has time out. Do you want to continue or logout';
      this.timedOut = true;
      console.log(this.idleState);
      this.cookieService.set('timedout', 'true', 100, null, null, true, 'Strict');
      this.idleModal();
      this.isOpenConfirmation = true;
    });

    // Keepalive / pinging
    this.keepalive.interval(15);  // ping every 15 seconds
    this.keepalive.onPing.subscribe(() => {
      this.lastPing = new Date();
    });

    // Start everything
    this.reset();
  }

  ngOnInit() {

  }

  public modalOptions : any = {};
  public isOpenConfirmation : boolean = false;

  public idleModal(){
    let modalOptions = {
      header : true,
      headerText : "Time Out",
      crossButton : false,
      body : true,
      bodyText : this.idleState,
      warning : false,
      warningText : "",
      footer : true,
      cancelButtonText : 'Logout',
      saveButtonText : 'Continue'
    }
    this.modalOptions = modalOptions
  }

  public hideIdleModal(){
    this.cookieService.delete('timedout', ' / ', 'localhost');
    this.cookieService.set('timedout', 'false', -1, null, null, true, 'Strict');
    this.isOpenConfirmation = false;
    this.modalOptions = {};
  }

  reset() {
    let userInfo = this.authService.getUserInfo();
    if(userInfo){
      this.idle.watch();         // start watching
      this.timedOut = false;
      this.lastPing = null;
      this.countdown = null;
    }else{
      this.idle.stop();
    }
  }

  public callMucSaveMethod(){
    this.reset();
    this.hideIdleModal();
  }

  public callMucCancelMethod(){
    this.idle.stop();
    this.hideIdleModal();
    this.logout();
  }

  public logout(){
    this.authService.removeCookies();
    this.cookieService.deleteAll('/', '/');
    this.cookieService.set('user_info', '', -1, null, null, true, 'Strict');
    this.router.navigate(['/auth/login']);
  }

}
