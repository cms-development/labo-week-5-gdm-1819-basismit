import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Token } from './token';
import { Route, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }
    private base = 'http://labo5.local';
    private baseUrl = this.base + '/oauth/token';

    login(data) {
      this.http.post(this.baseUrl,
        `grant_type=password&` +
        `client_id=a9760718-2183-4c86-b2d5-d442fd8dd874&` +
        `client_secret=testtest&` +
        `scope=app&` +
        `username=${data.username}&` +
        `password=${data.password}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        ).subscribe(response => {
          console.log(response);
          this.setLocalStorage(response);
          this.router.navigate(['articles']);
        });

        this.http.post(this.base + '/user/login?_format=json', {
          'name': data.username,
          'pass': data.password,
        }, {
          headers: {
            'Content-type': 'application/json'
          }
        }).subscribe(response => {
          console.log('get additional user info');
          console.log(response);
          localStorage.setItem('csrf_token', response.csrf_token);
        });
    }
    refresh() {
      this.http.post(this.baseUrl,
        `grant_type=refresh_token&` +
        `refresh_token=${localStorage.getItem('refresh_token')}&` +
        `client_id=a9760718-2183-4c86-b2d5-d442fd8dd874&` +
        `client_secret=testtest&` +
        `scope=app`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        ).subscribe(
          response => {
          this.setLocalStorage(response);
          },
          err => {
            console.log(err);
            localStorage.clear();
            this.router.navigate(['login']);
          }
        );
    }
    setLocalStorage(response) {
      const d = new Date();
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('token_expiration', d.getTime() +  response.expires_in);
    }
}
