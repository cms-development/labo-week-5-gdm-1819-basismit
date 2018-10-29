import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username = null;
  public password = null;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    ) { }

  ngOnInit() {
    if (localStorage.getItem('access_token')) {
      this.router.navigate(['articles']);
      this.authenticationService.refresh();
    }
  }
  login(): void {
    this.authenticationService.login({
      username: this.username,
      password: this.password,
    });
  }

}
