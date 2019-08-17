import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../interfaces/user';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { GeneralConfirmationComponent } from '../../../shared/components/general-confirmation/general-confirmation.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit {

  inputForm: FormGroup;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  @ViewChild('inputEmailRef') inputEmailElementRef: ElementRef;
  constructor(
    private fb: FormBuilder,
    public authenticationService: AuthService,
      private userService: UserService,
      private toastr: ToastrService,
      private modalService: BsModalService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser$ = x);
  }
  currentUser$: User;
  userData: User;

  userName = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit() {
    this.inputForm = this.fb.group({
      userName: this.userName,
      email: this.email,
    });
    this.getUserData();
  }

  ngAfterViewInit() {
    // Run after view init
    this.inputEmailFocus();
  }

  getUserData() {
    // Get user data
    this.loading = true;
    this.userService.doGetUser(this.currentUser$.userName).subscribe(data => {
      this.loading = false;
      this.userData = data;
      this.populateForm(this.userData);
    },
    err => {
      this.loading = false;
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }

  inputEmailFocus() {
    setTimeout(() => {
      // Autofocus on Dimension1 List parameter after page initialization
      this.inputEmailElementRef.nativeElement.focus();
      }, 500);
  }

  populateForm(data): void {
    this.inputForm.patchValue({
      userName: data.userName,
      email: data.email,
    });
  }

  changeEmail(formdata): void {
    if (this.inputForm.dirty && this.inputForm.valid) {
      this.loading = true;
      // Get user data
      this.userService.doChangeEmail(formdata).subscribe(data => {
        this.loading = false;
        this.subscriptions.push(
          this.modalService.onHide.subscribe((reason: string) => {
            // reset form
            this.getUserData();
            this.inputEmailFocus();
            this.unsubscribe();
          })
        );

        this.modalRef = this.modalService.show(GeneralConfirmationComponent, {
          class: 'modal-dialog-centered',
          keyboard: false,
          backdrop: 'static',
          initialState: {
            title: 'Email update success',
            data: { message: `An email has been sent to your email address ${formdata.email}. Please verify your new email.`}
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

  onCancel(): void {
    this.getUserData();
    this.inputEmailFocus();
  }
}
