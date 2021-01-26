import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const username = this.loginForm.get('username').value;
      const password = this.loginForm.get('password').value;

      this.authService.login(username, password)
        .subscribe(
          () => this.zone.run(() => {
            this.errorMessage = '';
            this.router.navigateByUrl('/dashboard');
          }),
          (err) => this.zone.run(() => {
            if (err.status === 400) {
              this.errorMessage = 'Invalid Credentials';
              console.log(this.errorMessage);
            } else {
              this.errorMessage = 'There was an error while logging in';
            }
          }),
        );
    }
  }

  isValidInput(fieldName): boolean {
    return this.loginForm.controls[fieldName].invalid &&
      (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched);
  }

  loginFailed(): boolean {
    return this.errorMessage.length > 0;
  }
}
