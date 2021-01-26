import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {of} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required,
        () => this.registerForm.get('password').value !== this.registerForm.get('password2').value
          ? of({ mismatch: true }) : of({})
      ]
    });
  }

  register() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {

      const username = this.registerForm.get('username').value;
      const password = this.registerForm.get('password').value;

      this.authService.register(username, password)
        .subscribe(
          () => this.zone.run(() => {
            this.errorMessage = '';
            this.router.navigateByUrl('/dashboard');
          }),
          (err) => this.zone.run(() => {
            if (err.status === 400) {
              this.errorMessage = 'Username already taken';
              console.log(this.errorMessage);
            } else {
              this.errorMessage = 'There was an error while registering';
            }
          }),
        );
    }
  }

  isValidInput(fieldName): boolean {
    return this.registerForm.controls[fieldName].invalid &&
      (this.registerForm.controls[fieldName].dirty || this.registerForm.controls[fieldName].touched);
  }
}
