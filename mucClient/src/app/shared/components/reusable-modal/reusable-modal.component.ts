import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reusable-modal',
  templateUrl: './reusable-modal.component.html',
  styleUrls: ['./reusable-modal.component.css']
})
export class ReusableModalComponent implements OnInit {

  public modalOptions : any = {};
  @Input('mucModalOptions')set mucModalOptions(value){
    if(value){
      this.modalOptions = value;
    }
  }

  @Output() mucSaveMethod = new EventEmitter();
  @Output() mucCancelMethod = new EventEmitter();
  @Output() mucCrossMethod = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public onClickSaveButton(action_type){
    this.mucSaveMethod.emit(action_type);
  }

  public onClickCancelButton(action_type){
    this.mucCancelMethod.emit(action_type);
  }

  public onClickCrossButton(action_type){
    this.mucCrossMethod.emit(action_type);
  }

}
