import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { ExcelUploaderService } from 'src/app/Services/exceluploader.service';
import { SyncConfigProcessorService } from 'src/app/Services/sync-config-processor.service';
import { environment } from 'src/env/environment';

@Component({
  selector: 'app-sync-complete',
  templateUrl: './sync-complete.component.html',
  styleUrls: ['./sync-complete.component.scss']
})
export class SyncCompleteComponent {
  smsLogo: string = environment.assets.smsLogo;

  constructor(
    private router: Router,
    private authService: AuthService,
    private excelService: ExcelUploaderService,
    private syncConfigService: SyncConfigProcessorService,
    private _snackBar: MatSnackBar
  ) { }

  restartProcess(): void {
    this.excelService.clearExcelData();
    this.syncConfigService.clearProcessedData();
    this.router.navigate(['/start']);
  }

  logout() {
    this.authService.logout();
    this.excelService.clearExcelData();
    this.syncConfigService.clearProcessedData();
    this.router.navigate(['/login']);
  }
}
