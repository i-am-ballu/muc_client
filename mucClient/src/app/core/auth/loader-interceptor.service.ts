import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'src/app/core/auth/loader.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService {
  private request_array = [];

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    this.request_array.push(req);
    return next.handle(req).pipe(
      finalize(() => {
        this.removeRequest(req);
        if(!this.request_array.length){
          this.loaderService.hide()
        }
      })
    );
  }

  public removeRequest(req){
    const i = this.request_array.indexOf(req);
    if(i >= 0){
      this.request_array.splice(i, 1);
    }
    this.loaderService.show();
  }
}
