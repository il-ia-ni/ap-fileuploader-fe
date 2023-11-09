import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { ExcelUploaderService } from 'src/app/Services/exceluploader.service';
import { SyncConfigProcessorService } from 'src/app/Services/sync-config-processor.service';
import { environment } from 'src/env/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private authServiceSubsription?: Subscription;

  smsLogo: string = environment.assets.smsLogo;

  isAuthenticated: boolean = false;
  userName: string = "";

  constructor(
    private authService: AuthService,
    private excelService: ExcelUploaderService,
    private router: Router,
    private syncConfigService: SyncConfigProcessorService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    try {
      if (!this.authService.userJWT.value) {
        this.authService.restoreAuthentication();
      };
    }
    catch (ex: any) {}
    finally {
      this.authServiceSubsription = this.authService.userJWT.subscribe(jwt => {
        this.isAuthenticated = !!jwt;
        if (jwt) {this.userName = this.authService.decodeToken().unique_name!};
      });
    }
  }

  ngOnDestroy() {
    if (this.authServiceSubsription) {
      this.authServiceSubsription.unsubscribe();
    }
  }

  onLogoutClick() {
    this.authService.logout();
    this.excelService.clearExcelData();
    this.syncConfigService.clearProcessedData();
    this.router.navigate(['/login']);
    this._snackBar.open("You were successfully logged out", "Ok", { duration: 3000 });
  }
}
