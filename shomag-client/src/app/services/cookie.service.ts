import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private jwtKey = 'JWT';
  private userKey = 'USER';

  constructor() {}

  public getCookie(name: string) {
    const cookies: Array<string> = document.cookie.split(';');
    const cookiesLength: number = cookies.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < cookiesLength; i += 1) {
      c = cookies[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  public setCookie(name: string, value: string, expireDays: number = 10) {
    const expireDate: Date = new Date();
    expireDate.setTime(expireDate.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${expireDate.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}`;
  }

  public saveUserCookie(username: any) {
    this.setCookie(this.userKey, username);
  }

  public saveJWTCookie(jwt: string) {
    this.setCookie(this.jwtKey, jwt);
  }

  public getUserCookie(): any {
    const userJson = this.getCookie(this.userKey);

    if (userJson === undefined || userJson === null || userJson === '' ) {
      return undefined;
    }
    return userJson;
  }

  public getJWTCookie(): string {
    return this.getCookie(this.jwtKey);
  }

  public hasJWTCookie() {
    return this.getCookie(this.jwtKey) !== '';
  }

  public deleteCookie(name) {
    this.setCookie(name, '', -1);
  }

  clearCookies() {
    this.deleteCookie(this.jwtKey);
    this.deleteCookie(this.userKey);
  }
}
