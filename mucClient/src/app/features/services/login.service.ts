import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiBaseUrl; // ✅ use it here
  constructor(private http: HttpClient) {

  }

  login(body){
    // return this.http.get(`${this.baseUrl}/login`, {params : body});
    return this.http.post(`${this.baseUrl}/login`, body);
  }

  getSuperAdminDetails(body){
    return this.http.get(this.baseUrl+"/accounts/getSuperAdminDetails/", {params : body});
  }


  getCountries(body) {
    return this.http.get(this.baseUrl+"/locations/countries/", {params : body});
  }

  getStates(body) {
    return this.http.post<any>(this.baseUrl+"/locations/states/", body);
  }

  getCities(body) {
    return this.http.post<any>(this.baseUrl+"/locations/cities/", body);
  }
}
