import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiBaseUrl; // ✅ use it here
  constructor(private http: HttpClient) {

  }

  upsertUser(body){
    return this.http.post(`${this.baseUrl}/register/users/add/`, body);
  }

  login(body){
    return this.http.post(`${this.baseUrl}/register/login/`, body);
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

  getAllUsersBasedOnCompanyId(body){
    return this.http.get(`${this.baseUrl}/register/users/`, {params : body});
  }

  getUserDetailsBasedOnUserId(body){
    return this.http.post(this.baseUrl+"/water_logs/getUserPaymentStatusDetails/", body);
  }

  upsertUserDetailsBasedOnUserId(body){
    return this.http.post<any>(this.baseUrl+"/water_logs/upsert-log/", body);
  }

  // start for sa-home

  getSuperAdminSupportDetailsBasedOnCompany(body){
    return this.http.get(this.baseUrl+"/activity_stream/getSuperAdminSupportDetailsBasedOnCompany/", {params : body});
  }

  getSuperAdminActivityStreamBasedOnCompany(body){
    return this.http.get(this.baseUrl+"/activity_stream/getSuperAdminActivityStreamBasedOnCompany/", {params : body});
  }

  getYearMonthListBasedOnUserId(body){
    return this.http.get(this.baseUrl+"/activity_stream/getYearMonthListBasedOnUserId/", {params : body});
  }

  // start for sa-user Component
  getPendingPayments(body){
    return this.http.get(this.baseUrl+"/water_logs/get_pending_payments/", {params : body});
  }

  upsertPendingPayment(body){
    return this.http.post<any>(this.baseUrl+"/water_logs/insert_payments/", body);
  }

  downloadMonthlyTemplate(body){
    return this.http.post<any>(this.baseUrl+"/water_logs/downloadMonthlyTemplate/", body);
  }

  uploadExcelFile(obj){
    return this.http.post<any>(this.baseUrl+"/water_logs/uploadExcelFile/",obj,{
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  importComponentWaterLogsData(body){
    return this.http.post<any>(this.baseUrl+"/water_logs/importComponentWaterLogsData/", body);
  }

  // start for sa-distribution
  getInsightsWaterPayment(body){
    return this.http.post(this.baseUrl+"/activity_stream/getInsightsWaterPayment/", body);
  }

  // start for ad-home
  getAdminSupportDetailsBasedOnCompany(body){
    return this.http.get(this.baseUrl+"/activity_stream/getAdminSupportDetailsBasedOnCompany/", {params : body});
  }

  getAdminActivityStreamBasedOnCompany(body){
    return this.http.get(this.baseUrl+"/activity_stream/getAdminActivityStreamBasedOnCompany/", {params : body});
  }



  // common function

  errorMgmt(error: HttpErrorResponse){
    let errorMessage = '';
    if(error.error instanceof ErrorEvent){
      // Get client-side error
      errorMessage = error.error.message;
    }else{
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
