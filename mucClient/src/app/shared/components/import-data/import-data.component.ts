import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DataUploadService } from 'src/app/shared/services/data-upload.service'
import { LoginService } from "src/app/features/services/login.service";

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.css']
})
export class ImportDataComponent implements OnInit {

  public user_id : number = 0;
  @Input('selectedUserId')set selectedUserId(value) {
    if(value){
      this.user_id = value;
    }
  }

  public month_name : string = '';
  @Input('selectedMonth')set selectedMonth(value) {
    if(value){
      this.month_name = value;
    }
  }

  @Output() saveClicked = new EventEmitter<File>();
  @Output() cancelClicked = new EventEmitter<void>();
  @Output() downloadTemplateClicked = new EventEmitter<number>();

  constructor(
    private dataUploadService : DataUploadService,
    private loginService : LoginService,
  ) { }

  ngOnInit() {
  }


  // public uploadFiles(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (!input.files || input.files.length === 0) return;
  //
  //   this.file = input.files[0];
  //   this.fileName = this.file.name;
  //
  //   // Optional: reset the progress bar
  //   this.progress = 0;
  //
  //   // Proceed with upload
  //   this.uploadProductWiseData(this.file);
  //
  //   // Reset file input so user can re-upload same file without refresh
  //   input.value = '';
  // }

  // uploadProductWiseData(file: File): void {
  //   // Create FormData
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('called_from_sts', 'true');
  //
  //   // ✅ Validate file type (example: Excel only)
  //   const allowedExtensions = /\.(xls|xlsx|csv)$/i;
  //   if (!allowedExtensions.test(this.fileName)) {
  //     this.alertSuccessErrorMsg('Please upload a valid Excel file (.xls, .xlsx, or .csv).', false, false);
  //     return;
  //   }

    // Upload via service
    // this.datauploadService.uploadExcelFile(formData).subscribe({
    //   next: (responseEvent: HttpEvent<any>) => {
    //     switch (responseEvent.type) {
    //       case HttpEventType.Sent:
    //         // Request sent
    //         break;
    //
    //       case HttpEventType.UploadProgress:
    //         this.progress = Math.round((responseEvent.loaded / (responseEvent.total || 1)) * 100);
    //         break;
    //
    //       case HttpEventType.Response:
    //         const { status, body } = responseEvent;
    //         if (status === 200 && body?.status) {
    //           this.uploadedFileName = body.filename;
    //           this.alertSuccessErrorMsg('File uploaded successfully.', true, false);
    //         } else {
    //           this.alertSuccessErrorMsg(body?.message || 'Error in uploading file.', false, true);
    //         }
    //         break;
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Upload failed:', err);
    //     this.alertSuccessErrorMsg('Error in uploading file.', false, true);
    //   },
    // });
  // }


  onSave() {
    // if (this.selectedFile) {
      this.saveClicked.emit();
    // }
  }

  onCancel() {
    // this.selectedFile = null;
    this.cancelClicked.emit();
  }

  public onClickDownloadTemplate(){
    const obj = {
      user_id: this.user_id,
      month_name: this.month_name,
    };
    this.loginService.downloadMonthlyTemplate(obj).subscribe({
      next: (res: any) => {
        console.log('res -------', res.data)
        this.dataUploadService.downloadTemplate(this.user_id,res.data.filename);
      },
      error: err => {
        console.log('error--------', err)
      }
    });
  }

  public downloadTemplate(){

  }

}
