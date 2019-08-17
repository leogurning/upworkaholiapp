import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AuthService } from '../../../../services/auth.service';
import { JobsService } from '../../../../services/jobs.service';
import { User } from '../../../../interfaces/user';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { GlobalFunctions } from '@app/common';
import { ViewjobdetailsComponent } from '../viewjobdetails/viewjobdetails.component';

@Component({
  selector: 'app-searchjob',
  templateUrl: './searchjob.component.html',
  styleUrls: ['./searchjob.component.css']
})
export class SearchjobComponent implements OnInit, AfterViewInit {

  inputForm: FormGroup;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  currentUser$: User;
  @ViewChild('inputSearchTextRef') inputSearchTextElementRef: ElementRef;
  jobs = [];
  totalrows = 0;
  // Required variables for pagination
  displayChunkDataArray = [];
  itemPerPage = 5;
  maxSize = 5;
  currentSearchText = '';
  currentPage: number;
  sortBy = 'createdDate';

  constructor(
    private fb: FormBuilder,
      public authenticationService: AuthService,
      private modalService: BsModalService,
      private jobService: JobsService,
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

    this.refreshTable('', this.sortBy);
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
      this.currentSearchText = event.target.value;
      this.refreshTable(event.target.value, this.sortBy);
    }
  }

  searchJob(formdata): void {
    this.refreshTable(formdata.searchText, this.sortBy);
  }

  // Function to refresh freelancer data in every change event input parameters
  refreshTable(inputText: string, sortBy: string): void {
    this.loading = true;
    this.jobService.getJobsAggregate('', inputText, sortBy).subscribe(data => {
      this.loading = false;
      this.jobs = data;
      this.totalrows = data.length;
      if (this.jobs.length > 0) {
        this.displayChunkDataArray = this.jobs.slice(0, this.itemPerPage);
      }
    },
    err => {
      this.loading = false;
      this.jobs = [];
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.currentPage = event.page;
    this.displayChunkDataArray = this.jobs.slice(startItem, endItem);
  }

  viewJobDetails(jobId: string): void {
    // Unsubscribe modal component after closed
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        if (!this.modalRef.content.cancelAction) {
          // Do action refresh
          this.refreshTable(this.currentSearchText, this.sortBy);
        }
        // unsubscribe modal service
        this.unsubscribe();
      })
    );

    if (jobId) {
      const jobData = this.jobs.filter(job => job._id === jobId);
      const isApplied = this.globalFunctions.isMember(jobData[0].applicants, this.currentUser$.userName);
      // This is modal component to display job details
      this.modalRef = this.modalService.show(ViewjobdetailsComponent, {
        class: 'gray modal-lg modal-dialog-centered',
        keyboard: false,
        backdrop: true,
        initialState: {
          user: this.currentUser$,
          data: jobData,
          isApplied,
        }
      });
    } else {
      this.toastr.error('No Job Id is selected.');
    }
  }

  // Unsubscribe every modal form subscriptions
  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }
}
