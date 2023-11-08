import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExcelParseResult } from '../Models/ExcelParseResult';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ExcelUploaderService {

  private static readonly excelDataKey = 'excelData';

  private responseSubject = new BehaviorSubject<ExcelParseResult>(new ExcelParseResult());
  response$: Observable<ExcelParseResult> = this.responseSubject.asObservable();

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  uploadFile(file: File): void {

    if (file.name.endsWith('.xlsx')) {
      const formData = new FormData();
      formData.append('file', file);
      this.http.post(environment.backendUrlDev + "/Excel/upload", formData, { responseType: 'json' })
        .subscribe(
          response => {
            const result = new ExcelParseResult();
            result.sheetData = response as Array<Object>;
            this.responseSubject.next(result);
            this.saveExcelData(this.responseSubject.value);  // saves data fetch result to LS
          },
          error => {
            const result = new ExcelParseResult();
            result.errorMessage = error;
            this.responseSubject.next(result);
            this.saveExcelData(this.responseSubject.value);  // saves data fetch result to LS
          }
        );
    }
    else {
      const result = new ExcelParseResult();
      result.errorMessage = "Invalid file format. Only .xlsx files are allowed";
      this.responseSubject.next(result);
      this.saveExcelData(this.responseSubject.value);  // saves data fetch result to LS
    }
  }

  responseAvailable(): boolean {
    return this.responseSubject.value.sheetData !== undefined || this.responseSubject.value.errorMessage !== undefined;
  }

  // Local storage mgmt area

  saveExcelData(data: ExcelParseResult): void {
    this.responseSubject.next(data);
    localStorage.setItem(ExcelUploaderService.excelDataKey, JSON.stringify(data));
  }

  restoreExcelData(): void {
    const storedData = localStorage.getItem(ExcelUploaderService.excelDataKey);
    if (storedData) {
      const parsedData = JSON.parse(storedData) as ExcelParseResult;
      this.responseSubject.next(parsedData);
    }
  }

  clearExcelData(): void {
    this.responseSubject.next(new ExcelParseResult());
    localStorage.removeItem(ExcelUploaderService.excelDataKey);
  }
}
