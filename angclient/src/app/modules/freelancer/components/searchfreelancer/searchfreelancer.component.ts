import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { FreelancerService } from '../../../../services/freelancer.service';
import { User } from '../../../../interfaces/user';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ModalviewfreelancerComponent } from '@app/modules/shared/components/modalviewfreelancer/modalviewfreelancer.component';
import { GlobalFunctions } from '@app/common';

@Component({
  selector: 'app-searchfreelancer',
  templateUrl: './searchfreelancer.component.html',
  styleUrls: ['./searchfreelancer.component.css']
})
export class SearchfreelancerComponent implements OnInit, AfterViewInit {

  inputForm: FormGroup;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  currentUser$: User;
  @ViewChild('inputSearchTextRef') inputSearchTextElementRef: ElementRef;
  defaultImg: string;
  freelancers = [];
  totalrows = 0;
  // Required variables for pagination
  displayChunkDataArray = [];
  itemPerPage = 8;
  maxSize = 5;

  constructor(
    private fb: FormBuilder,
      public authenticationService: AuthService,
      private userService: UserService,
      private modalService: BsModalService,
      private freelancerService: FreelancerService,
      private router: Router,
      private route: ActivatedRoute,
      private toastr: ToastrService,
      public globalFunctions: GlobalFunctions
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser$ = x);
  }

  searchText = new FormControl('', [Validators.nullValidator]);

  ngOnInit() {
    this.inputForm = this.fb.group({
      searchText: this.searchText,
    });

    this.defaultImg = 'assets/images/default_profile.jpg';
    this.refreshTable('');
  }

  ngAfterViewInit() {
    // Run after view init
    setTimeout(() => {
      // Autofocus on search text input parameter after page initialization
      this.inputSearchTextElementRef.nativeElement.focus();
      }, 500);
  }

  // Execute event to get forecast data after dimension1 and dimension2 list params is specified
  inputChangeEvent(event): void {
    if (this.inputForm.valid) {
      this.refreshTable(event.target.value);
    }
  }

  searchWorker(formdata): void {
    this.refreshTable(formdata.searchText);
  }

  // Function to refresh freelancer data in every change event input parameters
  refreshTable(inputText: string): void {
    this.loading = true;
    this.freelancerService.getFreelancers(inputText).subscribe(data => {
      this.loading = false;
      this.freelancers = data;
      this.totalrows = data.length;
      if (this.freelancers.length > 0) {
        this.displayChunkDataArray = this.freelancers.slice(0, this.itemPerPage);
      }
    },
    err => {
      this.loading = false;
      this.freelancers = [];
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.displayChunkDataArray = this.freelancers.slice(startItem, endItem);
  }

  showFreelancer(id) {
    // Unsubscribe modal component after closed
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // unsubscribe modal service
        this.unsubscribe();
      })
    );
    // This is modal component to display room availability check result.
    this.modalRef = this.modalService.show(ModalviewfreelancerComponent, {
      class: 'gray modal-lg modal-dialog-centered',
      keyboard: false,
      backdrop: true,
      initialState: {
        data: id,
      }
    });
  }

  // Unsubscribe every modal form subscriptions
  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  getRatingStars(rating?: number): string {
    let result = '0';
    result = this.globalFunctions.getRatingPercentage(rating);
    return result;
  }
}
