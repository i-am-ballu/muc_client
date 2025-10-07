import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataUploadService {

  private baseUrl = environment.apiBaseUrl; // ✅ use it here

  constructor(
    private cookieService: CookieService,
  ) { }

  public downloadTemplate(serverFilename: string){
    let userInfo = this.cookieService.check('user_info') ? JSON.parse(this.cookieService.get('user_info')) : {};
    let userId = 0;
    let fileName =  1+"_"+1+"_"+userInfo.company_id+"_details.xlsx";
    let path = this.baseUrl+"csv/"+fileName; //removed extra slash('/') from path
    console.log("path path path path", path);

    let linkElement = document.createElement('a');
    let url = path+"?request_type=export&token="+userInfo.token;
    linkElement.setAttribute('href', url);
    linkElement.setAttribute("download", fileName);
    let clickEvent = new MouseEvent("click", {
      "view": window,
      "bubbles": true,
      "cancelable": false
    });
    setTimeout(() => {
      linkElement.dispatchEvent(clickEvent);
    }, 100);
  }
}
