import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'
import { environment } from 'src/env/environment';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { AuthenticationResponse } from '../Models/AuthenticationResponse';
import { User } from '../Models/User';
import { Router } from '@angular/router';
import { FileUploaderJwt } from '../Models/FileUploaderJwt';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly tokenKeyName = "token";

  private readonly authObserver: { next: (resp: AuthenticationResponse) => void; error: (err: HttpErrorResponse) => void; };
  private authSubscription?: Subscription;

  public userJWT: BehaviorSubject<string>;
  private isAuthenticationFailedSubject: Subject<String>;
  invalidCredentialsObservable$: Observable<String>;

  get jwtLS(): string {
    return localStorage.getItem(AuthService.tokenKeyName) ?? '';
  }

  private set jwtLS(token: string) {
    localStorage.setItem(AuthService.tokenKeyName, token);
  }

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar
  ) {

    this.userJWT = new BehaviorSubject("");

    this.isAuthenticationFailedSubject = new Subject<String>();
    this.invalidCredentialsObservable$ = this.isAuthenticationFailedSubject.asObservable();

    this.authObserver = {
      next: (resp: AuthenticationResponse) => {
        if (resp.token) {
          this.jwtLS = resp.token;

          this.userJWT.next(this.jwtLS);  // Makes sure that the same value is stored in the memory as in the local storage

          this.router.navigate(['']);
        }
        else throw Error("Token data is missing in the successful server response!");
      },

      error: (err: HttpErrorResponse) => {
        if (err.status === 0) {   // for network errors
          throw Error('A network error occured while contacting the server!');
        }
        else {
          const errMssgResponse = (err.error as AuthenticationResponse).error!;
          if (err.status >= 400 && err.status < 600) {
            this.isAuthenticationFailedSubject.next(errMssgResponse);

            console.log(errMssgResponse);
            throw Error("Couldn't authenticate: Token data is missing.");
          }
          else throw Error('Unknown authentication error.');
        }
      }
    }
  }

  authenticate(user: User): void {
    this.authSubscription = this.httpClient.post<AuthenticationResponse>(`${environment.backendUrlDev}/api/Auth/login`, user)
      .subscribe(this.authObserver);
  }

  restoreAuthentication(): void {
    if ((this.isAuthenticated() && !this.isTokenExpired())) {
      this.userJWT.next(this.jwtLS);
    }
    else if (this.isAuthenticated() && this.isTokenExpired()) {
      this.logout();
      throw Error("Couldn't restore authentication. Token has expired. Please log in again");
    }
    else {
      throw Error("Couldn't restore authentication. Token is missing.");
    }
  }


  isAuthenticated(): boolean {
    return !!this.jwtLS;  // if string value is faulsy ("") returns false, if truthy ("abc") returns true
  }

  isTokenExpired(): boolean {
    const helper = new JwtHelperService();
    return helper.isTokenExpired(this.jwtLS) as boolean;
  }

  decodeToken(): FileUploaderJwt {
    const helper = new JwtHelperService();
    return helper.decodeToken(this.jwtLS) as FileUploaderJwt;
  }

  logout() {
    localStorage.clear();
    this.authSubscription ? this.authSubscription.unsubscribe() : "";
  }
}
