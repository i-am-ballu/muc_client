import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isLoggedIn(){
    return true;
  }

  public loginUser(body){
    return true;
  }
}
