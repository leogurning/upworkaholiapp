import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { GeneralConfirmationComponent } from '../../../shared/components/general-confirmation/general-confirmation.component';
import { ServiceErrorResponse } from '../../../../interfaces/service-response';

@Component({
  selector: 'app-registerclient',
  templateUrl: './registerclient.component.html',
  styleUrls: ['./registerclient.component.css']
})
export class RegisterclientComponent implements OnInit {

  inputForm: FormGroup;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  userName = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,20}$')]);
  retypepass = new FormControl('', [Validators.required]);
  userType = new FormControl('FREELANCER', [Validators.required]);

  ngOnInit() {

    this.inputForm = this.fb.group({
      userName: this.userName,
      email: this.email,
      passwordGroup: this.fb.group({
        password: this.password,
        retypepass: this.retypepass,
      }, {validator: comparePassword}),
      userType: this.userType
    });

  }

  addUserclient(formdata: any): void {

    if (this.inputForm.dirty && this.inputForm.valid) {
      const theForm = formdata;
      const thePass = formdata.passwordGroup.password;
      theForm.password = thePass;
      delete theForm.passwordGroup;

      this.loading = true;
      this.userService.registerUser(theForm)
      .subscribe(data => {
          this.loading = false;
          this.subscriptions.push(
            this.modalService.onHide.subscribe((reason: string) => {
              // reset form
              this.inputForm.reset();
              this.unsubscribe();
            })
          );

          this.modalRef = this.modalService.show(GeneralConfirmationComponent, {
            class: 'modal-dialog-centered',
            keyboard: false,
            backdrop: 'static',
            initialState: {
              title: 'User Registration success',
              data: { message: `An email has been sent to your email address ${data.email}. Please confirm your registration.`}
            }
          });
      },
      err => {
        this.loading = false;
        const errResponse = (err as ServiceErrorResponse);
        this.toastr.error(errResponse.message);
      });
    }
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  onLogin(): void {
    this.router.navigate(['/login']);
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
