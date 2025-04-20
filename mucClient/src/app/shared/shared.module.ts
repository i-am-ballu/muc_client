import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';



@NgModule({
  declarations: [
    TopNavigationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TopNavigationComponent
  ]
})
export class SharedModule { }
