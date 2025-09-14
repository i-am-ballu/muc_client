import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ReusableModalComponent } from './components/reusable-modal/reusable-modal.component';



@NgModule({
  declarations: [
    TopNavigationComponent,
    DataTableComponent,
    ReusableModalComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule
  ],
  exports: [
    TopNavigationComponent,
    DataTableComponent,
    NgxDatatableModule,
    ReusableModalComponent
  ]
})
export class SharedModule { }
