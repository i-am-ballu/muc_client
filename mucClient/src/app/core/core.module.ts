import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from 'src/app/core/auth/token-interceptor.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    TokenInterceptorService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
  ]
})
export class CoreModule { }
