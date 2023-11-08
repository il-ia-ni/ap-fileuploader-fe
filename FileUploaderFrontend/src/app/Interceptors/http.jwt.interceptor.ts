import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest }
                  from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { environment } from 'src/env/environment';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isAuthenticated = this.authService.isAuthenticated();
    const isValidDestination = req.url.startsWith(environment.backendUrlDev);  // ensures jwt is sent only with valid http requests

    if (isAuthenticated && isValidDestination) {
      req = req.clone({
        setHeaders: {Authorization: `Bearer ${this.authService.userJWT.value}`}
      });
    }

    return next.handle(req);
  }
}
