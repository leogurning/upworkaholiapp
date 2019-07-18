import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { GeneralConfirmationComponent } from '../../../shared/components/general-confirmation/general-confirmation.component';
import { ServiceErrorResponse } from '../../../../interfaces/service-response';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  inputForm: FormGroup;
  loading = true;
  modalRef: BsModalRef;
  result: string;
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) { }

  vhash: string;
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,20}$')]);
  retypepass = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.loading = true;
    this.sub = this.route.queryParams.subscribe(
      params => {
        const hash = params['id'];
        this.userService.doPageVerification(hash)
        .subscribe(data => {
            this.loading = false;
            this.vhash = data;
        },
        err => {
          this.loading = false;
          this.router.navigate(['/errorpage']);
          const errResponse = (err as ServiceErrorResponse);
          this.toastr.error(errResponse.message);
        });
      });
    this.inputForm = this.fb.group({
      passwordGroup: this.fb.group({
        password: this.password,
        retypepass: this.retypepass,
      }, {validator: comparePassword})
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  resetUserPassword(formdata: any): void {
    if (this.inputForm.dirty && this.inputForm.valid) {

      const theForm = formdata;
      const thePass = formdata.passwordGroup.password;
      theForm.password = thePass;
      delete theForm.passwordGroup;
      theForm.vhash = this.vhash;

      this.loading = true;
      this.userService.doResetPassword(theForm)
      .subscribe(data => {
          this.loading = false;

          this.subscriptions.push(
            this.modalService.onHide.subscribe((reason: string) => {
              this.inputForm.reset();
              this.unsubscribe();
              this.router.navigate(['/login']);
            })
          );

          this.modalRef = this.modalService.show(GeneralConfirmationComponent, {
            class: 'modal-dialog-centered',
            keyboard: false,
            backdrop: 'static',
            initialState: {
              title: 'Reset password success',
              data: { message: 'Your password has been reset. Please use your new password.'}
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
