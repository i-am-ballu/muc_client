import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ReusableModalComponent } from './components/reusable-modal/reusable-modal.component';
import { LoaderComponent } from './components/loader/loader.component';



@NgModule({
  declarations: [
    TopNavigationComponent,
    DataTableComponent,
    ReusableModalComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule
  ],
  exports: [
    TopNavigationComponent,
    DataTableComponent,
    NgxDatatableModule,
    ReusableModalComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
