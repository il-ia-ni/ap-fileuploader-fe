import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ExcelUploaderService } from 'src/app/Services/exceluploader.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SyncConfigProcessorService } from 'src/app/Services/sync-config-processor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(
    private authService: AuthService,
    private excelService: ExcelUploaderService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private syncConfigService: SyncConfigProcessorService,
    private _snackBar: MatSnackBar
  ) { }

  // Check if "Restart process" bttn visible
  isRestartVisible(): boolean {
    return this.authService.isAuthenticated() && !this.authService.isTokenExpired();
  }

  // Check if "Restart process" bttn deactivated
  isRestartDisabled(): boolean {
    return !(this.excelService.responseAvailable() || this.syncConfigService.processedDataAvailable());  // restart possible only if any data already stored
  }

  // Clear data and restart
  restartProcess(): void {
    this.excelService.clearExcelData();
    this.syncConfigService.clearProcessedData();
    this.router.navigate(['/start']);
    this._snackBar.open("Cached data was successfully cleared", "Ok", { duration: 5000 });
  }

  // Check if "Confirm" bttn visible
  isConfirmVisible(): boolean {
    return this.router.url === '/syncconfig';
  }

  // Process excel data to db-entities using excelconfig collection
  async onConfirmClick() {
    if (this.syncConfigService.getSyncConfigs().every(conf => conf.isFilledByUser)) {
      this.spinner.show();
      this.syncConfigService.processExcelRows();
      this.spinner.hide();
      this.router.navigate(['/syncpreview']);
    }
    else {
      this._snackBar.open("Please set up all database columns either with an excel column name or with a default value", "Ok", { duration: 5000 });
    }
  }

  // Check if "Submit data" bttn visible
  isSubmitVisible(): boolean {
    return this.router.url === '/syncpreview';
  }

  // Post db instances to backend and process results
  async onSubmitClick() {
    this.spinner.show();
    var entitiesUploaded = 0;
    await this.syncConfigService.synchronizeExcelData()
      .then(res => {
        this.spinner.hide();
        if (typeof (res) == 'number') {
          entitiesUploaded = res;
          const msg = "Uploaded successfully " + entitiesUploaded + " entities to the db!";
          this.router.navigate(['/synccomplete']);
          this._snackBar.open(msg, "Ok", { duration: 5000 });
        }
        else if (res instanceof HttpErrorResponse) {
          const errorMssg = `Server responded with an error: ${res.status} ('${res.name}'): ${JSON.stringify(res.error)}`;
          this._snackBar.open(errorMssg, "Ok");  // {duration: 5000} as 3 param sets auto dismiss in seconds
        }
        else {  // unforseen eceptions
          this._snackBar.open(JSON.stringify(res), "Ok");
          console.log(res);
        }
      })
      .catch(error => {
        this._snackBar.open('Synchronization error occured: ' + error, "Ok", { duration: 5000 });
      });
  }

}
