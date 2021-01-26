import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {CookieService} from './cookie.service';
import {of} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { }

  login(username: string, password: string) {
    return this.http.post<any>('/api/login', {username, password})
      .pipe(
        switchMap((response) => of(this.cookieService.saveJWTCookie(response.authToken))),
        switchMap(() => of(this.cookieService.saveUserCookie(username)))
      );
  }

  register(username: string, password: string) {
    return this.http.post<any>('/api/register', {username, password}).pipe(
      switchMap((response) => of(this.cookieService.saveJWTCookie(response.authToken))),
      switchMap(() => of(this.cookieService.saveUserCookie(username)))
    );
  }

  getUserName() {
    return this.cookieService.getUserCookie();
  }

  logOut() {
    this.cookieService.clearCookies();
    this.router.navigateByUrl('/login');
  }

  isLogged() {
    return !!this.getUserName();
  }
}
