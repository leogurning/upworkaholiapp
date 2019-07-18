import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../interfaces/user';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit, AfterViewInit {
  inputForm: FormGroup;
  userObj: any;
  loading = false;
  @ViewChild('inputoldpasswordRef') inputoldpasswordRef: ElementRef;

  constructor(private fb: FormBuilder,
    public authenticationService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser$ = x);
    }

  currentUser$: User;
  oldpassword = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,20}$')]);
  retypepass = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.inputForm = this.fb.group({
      oldpassword: this.oldpassword,
      passwordGroup: this.fb.group({
        password: this.password,
        retypepass: this.retypepass,
      }, {validator: comparePassword})
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputoldpasswordRef.nativeElement.focus();
    }, 300);
  }

  updatePassword(formdata: any): void {
    if (this.inputForm.dirty && this.inputForm.valid) {
      const theForm = formdata;
      const thePass = theForm.passwordGroup.password;
      theForm.password = thePass;
      delete theForm.passwordGroup;
      this.loading = true;
      this.userService.doUpdatePassword(this.currentUser$.userName, theForm)
        .subscribe(data => {
          this.loading = false;
          this.toastr.success('Password successfully updated.');
          this.inputForm.reset();
      },
      err => {
        this.loading = false;
        const errResponse = (err as ServiceErrorResponse);
        this.toastr.error(errResponse.message);
      });
    }
  }
  onBack(): void {
    this.router.navigate(['/dashboard']);
  }

}

function comparePassword(c: AbstractControl): {[key: string]: boolean} | null {
  const passwordControl = c.get('password');
  const confirmControl = c.get('retypepass');

  if (passwordControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (passwordControl.value === confirmControl.value) {
      return null;
  }
  return { 'mismatchedPassword': true };
}
