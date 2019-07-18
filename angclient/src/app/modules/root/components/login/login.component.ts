import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { AuthService } from '../../../../services/auth.service';
import { first } from 'rxjs/operators';
import { ServiceErrorResponse } from '../../../../interfaces/service-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) {}

  userName = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  loginForm: FormGroup = this.fb.group({
    userName: this.userName,
    password: this.password,
  });

  ngOnInit() {
    this.authService.logout();
  }

  loginUser(formdata: any): void {
    // Check login form validity
    if (this.loginForm.dirty && this.loginForm.valid) {
      // console.log(formdata);
      this.loading = true;
      this.authService.login(formdata)
        .pipe(first())
        .subscribe(data => {
            this.loading = false;
            this.loginForm.reset();
            this.router.navigate(['dashboard']);
        },
      err => {
        this.loading = false;
        const errResponse = (err as ServiceErrorResponse);
        this.toastr.error(errResponse.message);
      });
    }
  }

}
