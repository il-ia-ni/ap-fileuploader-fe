import { Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelUploaderService } from 'src/app/Services/exceluploader.service';
import { Router } from '@angular/router';
import { environment } from 'src/env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {

  smsLogo: string = environment.assets.smsLogo;

  @ViewChild('fileInput')
  fileInput?: ElementRef;

  private isValidUploadSubject = new BehaviorSubject<boolean>(false);
  isValidUpload$: Observable<boolean> = this.isValidUploadSubject.asObservable();

  isLoading: boolean = false;

  private excelServiceSubscription?: Subscription;

  constructor(
    private excelService: ExcelUploaderService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.excelService.restoreExcelData();
    this.excelServiceSubscription = this.excelService.response$.subscribe(response => {
      this.isLoading = false;
      this.spinner.hide();
      if (response.errorMessage != undefined) {
        this._snackBar.open("The server responded with an error: " + response.errorMessage, "Ok", { duration: 5000 });
      } else if (response.sheetData != undefined) {
        this.router.navigate(['/syncconfig']);
      }
    });
  }

  ngOnDestroy() {
    if (this.excelServiceSubscription) {
      this.excelServiceSubscription.unsubscribe();
    }
  }

  onFileChange(input: any) {
    const file = input.files[0];
    ; if (file && file.name.endsWith('.xlsx')) {
      this.isValidUploadSubject.next(true);
      try {
        this.fileInput!.nativeElement.value = file.name;  // Chg lbl to file name
      } catch (error) { }
    } else if (file) {
      this.isValidUploadSubject.next(false);
      this._snackBar.open("Only files with XLSX-extension are allowed", "Ok", { duration: 3000 });
    }
  }

  onSubmitClick() {
    const file = this.fileInput!.nativeElement.files[0];
    if (file) {
      // if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      if (file && file.name.endsWith('.xlsx')) {
        this.isLoading = true;
        this.spinner.show();
        this.excelService.uploadFile(file);
      }
    }
  }

  isFileSelected(fileInput: HTMLInputElement): boolean {
    return fileInput ? (fileInput!.files!.length > 0) : false;
  }
}
