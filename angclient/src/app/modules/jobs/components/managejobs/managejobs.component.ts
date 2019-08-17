import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from '../../../../common/toastr.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { User } from '../../../../interfaces/user';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { JobsService } from '../../../../services/jobs.service';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GlobalFunctions } from '@app/common';
import { FreelancerService } from '../../../../services/freelancer.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ModalviewfreelancerComponent } from '@app/modules/shared/components/modalviewfreelancer/modalviewfreelancer.component';
// tslint:disable-next-line: max-line-length
import { GeneralYesnoConfirmationComponent } from '@app/modules/shared/components/general-yesno-confirmation/general-yesno-confirmation.component';

@Component({
  selector: 'app-managejobs',
  templateUrl: './managejobs.component.html',
  styleUrls: ['./managejobs.component.css']
})
export class ManagejobsComponent implements OnInit, OnDestroy {
  inputForm: FormGroup;
  modalTitle: string;
  currentUser$: User;
  jobId: string;
  cancelAction = false;
  private sub: Subscription;
  loading = false;
  modalRef: BsModalRef;
  job;
  applicants;
  offeredApplicants;
  subscriptions: Subscription[] = [];

  // Required variables for pagination applicants
  displayChunkApplicantsArray = [];
  displayChunkOfferedApplicantsArray = [];
  currentPageApplicants = 1;
  currentPageOfferedApplicants = 1;
  itemPerPage = 5;
  maxSize = 5;

  isOpen = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private jobService: JobsService,
    public globalFunctions: GlobalFunctions,
    private freelancerService: FreelancerService,
  ) { }

  searchText = new FormControl('', [Validators.nullValidator]);

  ngOnInit() {
    this.modalTitle = 'Manage jobs';

    this.inputForm = this.fb.group({
      searchText: this.searchText,
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.jobId = params['id'];
        this.refreshJobData(this.jobId);
    },
    err => {
        this.loading = false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  refreshJobData(jobId: string): void {
    this.loading = true;
    this.jobService.getJobsAggregate(jobId, '', '').subscribe(data => {
      // Get job data
      this.job = data[0];

      // Get isOpen or not
      if (this.job.status === 'OPEN') {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }

      // Get applicant and offered data
      if (this.job.applicants.length > 0) {
        // Get applicants
        this.refreshApplicantsTable('');
        if (this.job.offered.length > 0) {
          this.refreshApplicantsTable('', 'offered');
        }
      } else {
        this.loading = false;
      }
    },
    err => {
      this.loading = false;
      this.job = [];
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }

  pageChangedApplicants(event: PageChangedEvent, type: string = 'applicants'): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    if (type === 'offered') {
      this.currentPageOfferedApplicants = event.page;
      this.displayChunkOfferedApplicantsArray = this.offeredApplicants.slice(startItem, endItem);
    } else {
      this.currentPageApplicants = event.page;
      this.displayChunkApplicantsArray = this.applicants.slice(startItem, endItem);
    }
  }

  // Function to refresh freelancer data in every change event input parameters
  refreshApplicantsTable(inputText: string, type: string = 'applicants'): void {
    // Define payload for api service
    let payload = {
      userNameList: this.job.applicants
    };

    if (type === 'offered') {
      const nameList = this.job.offered.map(element => element.userName);

      payload = {
        userNameList: nameList
      };
    }
    this.freelancerService.getFreelancerList(inputText, payload).subscribe(dataApplicants => {
      this.loading = false;
      if (type === 'offered') {
        this.offeredApplicants = this.job.offered.map((element) => {
            const freelancerObj = _.find(dataApplicants, (applicant) => {
              // logic (StartA <= EndB)  and  (EndA >= StartB) to get date range overlap
              return applicant.userName === element.userName;
            });
            return {
              userName: element.userName,
              firstName: freelancerObj.firstName,
              lastName: freelancerObj.lastName,
              title: freelancerObj.title,
              offerStatus: element.offerStatus,
              remarks: element.remarks
            };
        });
        this.displayChunkOfferedApplicantsArray = this.offeredApplicants.slice(0, this.itemPerPage);
      } else {
        this.applicants = dataApplicants;
        this.displayChunkApplicantsArray = this.applicants.slice(0, this.itemPerPage);
      }
    },
    err => {
      this.loading = false;
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }

  // Execute event to get forecast data after dimension1 and dimension2 list params is specified
  inputApplicantsChangeEvent(event): void {
    if (this.inputForm.valid) {
      this.refreshApplicantsTable(event.target.value);
    }
  }

  // Offering the job function
  offerJob(jobId: string, userName: string): void {
    // Define payload for api service
    const payload = {
      jobId,
      userName,
    };
    this.loading = true;
    this.jobService.employerOfferJob(payload).subscribe(data => {
      this.refreshJobData(jobId);
      this.toastr.success('Offering Job Successfully.');
    },
    err => {
      this.loading = false;
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }

  viewWorker(id: string): void {
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

  cancelOffer(jobId: string, userName: string): void {
    // Unsubscribe modal component after closed
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        if (!this.modalRef.content.cancelAction) {
          // Do action
          // Call service to reject job offer;
          // Define payload for api service
          const payload = {
            jobId,
            userName,
          };
          this.loading = true;
          this.jobService.employerCancelJobOffer(payload).subscribe(data => {
            this.refreshJobData(jobId);
            this.toastr.success('Cancel Job Offer Successfully.');
          },
          err => {
            this.loading = false;
            const errResponse = (err as ServiceErrorResponse);
            this.toastr.error(errResponse.message);
          });
        }
        // unsubscribe modal service
        this.unsubscribe();
      })
    );

    if (jobId) {
      // This is modal component to display job details
      this.modalRef = this.modalService.show(GeneralYesnoConfirmationComponent, {
        class: 'gray modal-dialog-centered',
        keyboard: false,
        backdrop: true,
        initialState: {
          title: 'Confirmation',
          data: { message: 'Are you sure to cancel the job offer ?' },
          isRemarks: false,
        }
      });
    } else {
      this.toastr.error('No Job Id is selected.');
    }
  }

  startJob(jobId: string, applicantName: string) {
    // Unsubscribe modal component after closed
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        if (!this.modalRef.content.cancelAction) {
          // Do action
          // Call service to reject job offer;
          // Define payload for api service
          const payload = {
            jobId,
            applicantName,
          };
          this.loading = true;
          this.jobService.startJob(payload).subscribe(data => {
            this.refreshJobData(jobId);
            this.toastr.success('Starting Job Successfully.');
          },
          err => {
            this.loading = false;
            const errResponse = (err as ServiceErrorResponse);
            this.toastr.error(errResponse.message);
          });
        }
        // unsubscribe modal service
        this.unsubscribe();
      })
    );

    if (jobId) {
      // This is modal component to display job details
      this.modalRef = this.modalService.show(GeneralYesnoConfirmationComponent, {
        class: 'gray modal-dialog-centered',
        keyboard: false,
        backdrop: true,
        initialState: {
          title: 'Confirmation',
          data: { message: 'Are you sure to start the job ?' },
          isRemarks: false,
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

  goBack(): void {
    // Go to list job route
    this.router.navigate([`jobs`]);
  }
}
