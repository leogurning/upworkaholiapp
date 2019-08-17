import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { User } from '../../../../interfaces/user';
import { AuthService } from '../../../../services/auth.service';
import { SavejobsComponent } from '@app/modules/jobs/components/savejobs/savejobs.component';
import { JobsService } from '../../../../services/jobs.service';
import { ToastrService } from '../../../../common/toastr.service';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import * as moment from 'moment';
import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd } from '@angular/router';
import { JobStatus } from '@app/common/variables';

@Component({
  selector: 'app-listjobs',
  templateUrl: './listjobs.component.html',
  styleUrls: ['./listjobs.component.css']
})
export class ListjobsComponent implements OnInit, AfterViewInit {

  inputForm: FormGroup;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  currentUser$: User;
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
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser$ = x);
  }

  searchText = new FormControl('', [Validators.nullValidator]);

  ngOnInit() {
    this.currentPage = 1;
    this.currentSearchText = '';
    this.inputForm = this.fb.group({
      searchText: this.searchText,
    });
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
      this.currentSearchText = event.target.value;
      this.refreshTable(event.target.value);
    }
  }

  searchJob(formdata): void {
    this.refreshTable(formdata.searchText);
  }

  // Function to refresh freelancer data in every change event input parameters
  refreshTable(inputText: string): void {
    this.loading = true;
    this.jobService.getJobs(this.currentUser$.userName, inputText).subscribe(data => {
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

  addJob() {
    this.goToSave();
  }

  editJob(id: string) {
    this.goToSave(id);
  }

  goToSave(jobId?: string) {
    // Unsubscribe modal component after closed
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        if (!this.modalRef.content.cancelAction) {
          // Do refresh the job list
          this.refreshTable(this.currentSearchText);
        }
        // unsubscribe modal service
        this.unsubscribe();
      })
    );
    let jobPayload = {};

    if (jobId) {
      const jobData = this.jobs.filter(job => job._id === jobId);

      if (jobData[0].status === JobStatus.OPEN) {
        jobPayload = {
          jobs: jobData,
          type: 'edit'
        };
      } else {
        jobPayload = {
          jobs: jobData,
          type: 'view'
        };
      }
    } else {
      jobPayload = {
        jobs: [],
        type: 'add'
      };
    }
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

  goToManageJob(jobId: string): void {
    // Go to manage job route
      this.router.navigate([`jobs/manage/${jobId}`]);
  }

  // Unsubscribe every modal form subscriptions
  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  dateToString(_date: Date): string {
    let result = '';
    result = moment(_date).format('DD/MM/YYYY');
    return result;
  }
}
