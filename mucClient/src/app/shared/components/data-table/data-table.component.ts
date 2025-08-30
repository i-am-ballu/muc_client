import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  public columnDefs : any[] = [];
  @Input('mucColumnDefs')set mucColumnDefs(value){
    if(value){
      this.columnDefs = value;
    }
  }

  public rowsData : any[] = [];
  @Input('mucRowsData')set mucRowsData(value){
    if(value){
      this.rowsData = value;
    }
  }

  public page_size : number = 0;
  @Input('mucPageSize')set mucPageSize(value){
    this.page_size = value;
  }

  public count : number = 0;
  @Input('mucCount')set mucCount(value){
    this.count = value;
  }

  public offset : number = 0;
  @Input('mucOffset')set mucOffset(value){
    this.offset = value;
  }

  public selected : any[] = [];
  @Input('mucSelected')set mucSelected(value){
    if(value){
      this.selected = value;
    }
  }

  constructor() { }

  ngOnInit() {
    console.log(this)
  }

  @Output() mucOnSelect = new EventEmitter();

  public onSelect({ selected }) {
    this.mucOnSelect.emit(selected);
  }

  @Output() mucOnClickAbleRow = new EventEmitter();
  public onClickAbleRow(col, row){
    this.mucOnClickAbleRow.emit({col:col, row:row});
  }

}
