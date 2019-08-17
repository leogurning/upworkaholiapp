import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { User } from '../../../../interfaces/user';
import { AuthService } from '../../../../services/auth.service';
import { JobsService } from '../../../../services/jobs.service';
import { ToastrService } from '../../../../common/toastr.service';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import * as moment from 'moment';
import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd } from '@angular/router';
import { JobStatus } from '@app/common/variables';
import { GlobalFunctions } from '@app/common';
import { SavejobsComponent } from '@app/modules/jobs/components/savejobs/savejobs.component';

@Component({
  selector: 'app-completedjobs',
  templateUrl: './completedjobs.component.html',
  styleUrls: ['./completedjobs.component.css']
})
export class CompletedjobsComponent implements OnInit, AfterViewInit {
  inputForm: FormGroup;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  currentUser$: User;
  jobId: string;
  jobs = [];
  totalrows = 0;
  // Required variables for pagination
  displayChunkDataArray = [];
  itemPerPage = 8;
  maxSize = 5;
  currentPage: number;
  @ViewChild('inputSearchTextRef') inputSearchTextElementRef: ElementRef;
  currentSearchText: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public authenticationService: AuthService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private jobService: JobsService,
    public globalFunctions: GlobalFunctions
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser$ = x);
  }

  searchText = new FormControl('', [Validators.nullValidator]);

  ngOnInit() {
    this.jobId = this.route.snapshot.queryParams['job'] || '';
    this.currentPage = 1;
    this.inputForm = this.fb.group({
      searchText: this.searchText,
    });
    this.refreshTable(this.jobId, '', '');
  }

  ngAfterViewInit() {
    // Run after view init
    setTimeout(() => {
      // Autofocus on search text input parameter after page initialization
      this.inputSearchTextElementRef.nativeElement.focus();
      }, 500);
  }

  // Function to refresh freelancer data in every change event input parameters
  refreshTable(id: string, inputText: string, sortBy: string): void {
    this.loading = true;
    this.jobService.getAfterStartJobsAggregate(this.currentUser$.userName, id, inputText, JobStatus.CMPL, sortBy).subscribe(data => {
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

  // Execute event to get completed job
  inputChangeEvent(event): void {
    if (this.inputForm.valid) {
      this.currentSearchText = event.target.value;
      this.refreshTable(this.jobId, event.target.value, '');
    }
  }

  searchJob(formdata): void {
    this.refreshTable(this.jobId, formdata.searchText, '');
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.currentPage = event.page;
    this.displayChunkDataArray = this.jobs.slice(startItem, endItem);
  }

  viewJob(jobId: string) {
    // Unsubscribe modal component after closed
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // unsubscribe modal service
        this.unsubscribe();
      })
    );
    let jobPayload = {};

    const jobData = this.jobs.filter(job => job._id === jobId);
    jobPayload = {
      jobs: jobData,
      type: 'view'
    };

    // This is modal component to display room availability check result.
    this.modalRef = this.modalService.show(SavejobsComponent, {
      class: 'gray modal-dialog-centered',
      keyboard: false,
      backdrop: true,
      initialState: {
        jobId: jobId,
        user: this.currentUser$,
        data: jobPayload,
      }
    });
  }

  // Set milestone for the job
  goToMilestoneJob(jobId: string): void {
    // Go to manage job route
    this.router.navigate([`jobs/setmilestone/${jobId}`]);
  }

  getRatingStars(rating: number): string {
    let result = '0';
    result = this.globalFunctions.getRatingPercentage(rating);
    return result;
  }
  // Unsubscribe every modal form subscriptions
  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }
}
