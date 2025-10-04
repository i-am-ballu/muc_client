import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from 'src/app/core/auth/token-interceptor.service'
import { LoaderInterceptorService } from 'src/app/core/auth/loader-interceptor.service'
import { LoaderService } from 'src/app/core/auth/loader.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    LoaderService,
    TokenInterceptorService,
    LoaderInterceptorService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ]
})
export class CoreModule { }
