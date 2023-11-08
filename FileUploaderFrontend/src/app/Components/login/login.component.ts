import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/Models/User';
import { AuthService } from 'src/app/Services/auth.service';
import { environment } from 'src/env/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private authServiceSubsription?: Subscription;

  user: User;
  smsLogo: string = environment.assets.smsLogo;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.user = new User();
    this.authServiceSubsription = this.authService.invalidCredentialsObservable$.subscribe((value) => {
      this._snackBar.open("Couldn't sign in: " + value, "Ok", {duration: 5000});  // {duration: 5000} as 3 param sets auto dismiss in seconds
    });
  }

  ngOnDestroy() {
    if (this.authServiceSubsription) {
      this.authServiceSubsription.unsubscribe();
    }
  }

  onFormSubmit(e: any) {
    this.authService.authenticate(this.user);
    e.preventDefault();

  }

  logout() {
    this.authService.logout();
    this._snackBar.open("You were successfully logged out", "Ok", { duration: 3000 });
  }
}
