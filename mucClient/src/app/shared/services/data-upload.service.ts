import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataUploadService {

  private baseUrl = environment.apiBaseUrl; // ✅ use it here

  constructor(
    private cookieService: CookieService,
    private http: HttpClient
  ) { }

  public downloadTemplate(user_id, file_name){
    let userInfo = this.cookieService.check('user_info') ? JSON.parse(this.cookieService.get('user_info')) : {};
    let linkElement = document.createElement('a');
    let path = this.baseUrl+"/water_logs/csv/" + file_name;
    let url =  path + "?user_id=" + user_id;

    if(!userInfo.token){
      console.error('No JWT token found.');
      return;
    }
    // Set Authorization header
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo.token}`
    });

    // Make GET request to get the file as Blob
    this.http.get(url, { headers, responseType: 'blob' }).subscribe((blob: Blob) => {
      // Create a temporary link to download
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    }, error => {
      console.error('Download error', error);
    });
  }
}
