import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { DataTableComponent } from './components/data-table/data-table.component';



@NgModule({
  declarations: [
    TopNavigationComponent,
    DataTableComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule
  ],
  exports: [
    TopNavigationComponent,
    DataTableComponent,
    NgxDatatableModule
  ]
})
export class SharedModule { }
