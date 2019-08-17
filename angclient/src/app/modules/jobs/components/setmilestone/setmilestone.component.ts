import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { User } from '../../../../interfaces/user';
import { AuthService } from '../../../../services/auth.service';
import { JobsService } from '../../../../services/jobs.service';
import { MilestonesService } from '../../../../services/milestones.service';
import { ToastrService } from '../../../../common/toastr.service';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import * as moment from 'moment';
import { JobStatus, MilestoneStatusClient, MilestoneStatusWorker } from '@app/common/variables';
import { SavemilestoneComponent } from '../savemilestone/savemilestone.component';
import { GlobalFunctions } from '@app/common';
import { WorkerupdatesComponent } from '../workerupdates/workerupdates.component';
import { GeneralConfirmationComponent } from '../../../shared/components/general-confirmation/general-confirmation.component';
import { GiveratingComponent } from '../../../shared/components/giverating/giverating.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-setmilestone',
  templateUrl: './setmilestone.component.html',
  styleUrls: ['./setmilestone.component.css']
})
export class SetmilestoneComponent implements OnInit, OnDestroy {

  jobId: string;
  cancelAction = false;
  private sub: Subscription;
  loading = false;
  jobData: any = {};
  milestones = [];
  worker: any = {};

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  currentUser$: User;
  totalrows = 0;
  // Required variables for pagination
  displayChunkDataArray = [];
  itemPerPage = 10;
  maxSize = 5;
  currentPage = 1;
  milestoneStatusClient = MilestoneStatusClient;
  isReadyToComplete = false;
  workerToRate = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authenticationService: AuthService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private jobService: JobsService,
    private milestoneService: MilestonesService,
    public globalFunctions: GlobalFunctions
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser$ = x);
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(
      params => {
        this.jobId = params['id'];
        this.jobService.getAfterStartJobsAggregate(this.currentUser$.userName, this.jobId, '', JobStatus.ONGO, '').subscribe(data => {
          this.jobData = data[0];
          this.worker = this.jobData.freelancerdetails[0];
        },
        err => {
          const errResponse = (err as ServiceErrorResponse);
          this.toastr.error(errResponse.message);
        });
        this.refreshTable(this.jobId);
    },
    err => {
        this.loading = false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // Function to refresh freelancer data in every change event input parameters
  refreshTable(jobId: string, status?: string): void {
    this.loading = true;
    this.milestoneService.getMilestone(jobId, status).subscribe(data => {
      this.loading = false;
      this.milestones = data;
      this.totalrows = data.length;
      if (this.milestones.length > 0) {
        this.displayChunkDataArray = this.milestones.slice(0, this.itemPerPage);
      }
      this.checkOngoingMilestone();
      this.currentPage = 1;
    },
    err => {
      this.loading = false;
      this.milestones = [];
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.currentPage = event.page;
    this.displayChunkDataArray = this.milestones.slice(startItem, endItem);
  }

  goToSave(milestoneId?: string) {
    // Unsubscribe modal component after closed
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        if (!this.modalRef.content.cancelAction) {
          // Do refresh the job list
          this.refreshTable(this.jobId);
        }
        // unsubscribe modal service
        this.unsubscribe();
      })
    );
    let milestonePayload = {};

    if (milestoneId) {
      const milestoneData = this.milestones.filter(milestone => milestone._id === milestoneId);
      if (this.currentUser$.userType === 'FREELANCER') {
        milestonePayload = {
          milestone: milestoneData[0],
          type: 'view'
        };
      } else {
        if (milestoneData[0].statusFromWorker === MilestoneStatusWorker.NOTSTARTED
            && milestoneData[0].statusFromClient !== MilestoneStatusClient.CANCELLED) {
          milestonePayload = {
            milestone: milestoneData[0],
            type: 'edit'
          };
        } else {
          milestonePayload = {
            milestone: milestoneData[0],
            type: 'view'
          };
        }
      }
    } else {
      milestonePayload = {
        milestone: {},
        type: 'add'
      };
    }
    // This is modal component to display room availability check result.
    this.modalRef = this.modalService.show(SavemilestoneComponent, {
      class: 'gray modal-dialog-centered',
      keyboard: false,
      backdrop: true,
      initialState: {
        jobId: this.jobId,
        user: this.currentUser$,
        data: milestonePayload,
      }
    });
  }

  goToGiveFeedback(milestoneId: string): void {
   // Unsubscribe modal component after closed
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        if (!this.modalRef.content.cancelAction) {
          // Do refresh the job list
          this.refreshTable(this.jobId);
        }
        // unsubscribe modal service
        this.unsubscribe();
      })
    );
    let milestonePayload = {};

    if (milestoneId) {
      const milestoneData = this.milestones.filter(milestone => milestone._id === milestoneId);
      milestonePayload = {
        milestone: milestoneData[0],
        type: 'edit'
      };
    }
    // This is modal component to display room availability check result.
    this.modalRef = this.modalService.show(WorkerupdatesComponent, {
      class: 'gray modal-dialog-centered',
      keyboard: false,
      backdrop: true,
      initialState: {
        user: this.currentUser$,
        data: milestonePayload,
      }
    });
  }

  goToWorkerUpdates(milestoneId: string): void {
    // Unsubscribe modal component after closed
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        if (!this.modalRef.content.cancelAction) {
          // Do refresh the job list
          this.refreshTable(this.jobId);
        }
        // unsubscribe modal service
        this.unsubscribe();
      })
    );
    let milestonePayload = {};

    if (milestoneId) {
      const milestoneData = this.milestones.filter(milestone => milestone._id === milestoneId);
      milestonePayload = {
        milestone: milestoneData[0],
        type: 'edit'
      };
    }
    // This is modal component to display room availability check result.
    this.modalRef = this.modalService.show(WorkerupdatesComponent, {
      class: 'gray modal-dialog-centered',
      keyboard: false,
      backdrop: true,
      initialState: {
        user: this.currentUser$,
        data: milestonePayload,
      }
    });
  }

  goToViewWorkerUpdates(milestoneId: string): void {
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // no action
        this.unsubscribe();
      })
    );
    const milestoneData = this.milestones.filter(milestone => milestone._id === milestoneId);
    const workerUpdates =  milestoneData[0].workerUpdates;
    if (workerUpdates) {
      this.modalRef = this.modalService.show(GeneralConfirmationComponent, {
        class: 'modal-dialog-centered',
        keyboard: false,
        backdrop: 'static',
        initialState: {
          title: 'Worker updates',
          data: { message: workerUpdates}
        }
      });
    }
  }

  goToViewClientFeedback(milestoneId: string): void {
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // no action
        this.unsubscribe();
      })
    );
    const milestoneData = this.milestones.filter(milestone => milestone._id === milestoneId);
    const clientFeedback =  milestoneData[0].clientFeedback;
    if (clientFeedback) {
      this.modalRef = this.modalService.show(GeneralConfirmationComponent, {
        class: 'modal-dialog-centered',
        keyboard: false,
        backdrop: 'static',
        initialState: {
          title: 'Client Feedback',
          data: { message: clientFeedback}
        }
      });
    }
  }

  goToRequestForTransfer(milestoneId: string): void {

    const milestoneData = this.milestones.filter(milestone => milestone._id === milestoneId);
    const statusFromClient =  milestoneData[0].statusFromClient;
    const clientId = this.jobData.userName;

    if (statusFromClient === MilestoneStatusClient.APPROVED) {
      // If the status from client approved, can do transfer request
      // Check if rating must be given or not
      this.checkOngoingMilestone();

      // Create USD currency formatter.
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      });
      const milestoneAmount = formatter.format(milestoneData[0].milestoneAmount);

      // Give rating.
      if (this.workerToRate) {
        this.subscriptions.push(
          this.modalService.onHide.subscribe((reason: string) => {
            if (!this.modalRef.content.cancelAction) {
              // Do action to set client rating
              const payload = {
                jobId: this.jobId,
                clientRating: this.modalRef.content.returnData,
                clientId: clientId
              };
              // Save client rating
              this.loading = true;
              this.jobService.setClientRating(payload).subscribe(data => {
                this.loading = false;
                this.doTransferRequest(milestoneId, milestoneAmount);
              },
              err => {
                this.loading = false;
                const errResponse = (err as ServiceErrorResponse);
                this.toastr.error(errResponse.message);
              });
            }
            this.unsubscribe();
          })
        );

        this.modalRef = this.modalService.show(GiveratingComponent, {
          class: 'modal-dialog-centered',
          keyboard: false,
          backdrop: 'static',
          ignoreBackdropClick: false,
          initialState: {
            title: 'Client Rating',
            // tslint:disable-next-line: max-line-length
            data: { message: `Please give rating for your Client.`}
          }
        });
      } else {
        this.doTransferRequest(milestoneId, milestoneAmount);
      }
    } else {
      this.toastr.error('The Milestone is not approved yet');
    }
  }

  doTransferRequest(milestoneId: string, milestoneAmount: string): void {
    const payload = {
      milestoneId
    };
    // Save the Milestone Data
    this.loading = true;
    this.milestoneService.requestForTransfer(payload).subscribe(data => {
      this.loading = false;

      this.subscriptions.push(
        this.modalService.onHide.subscribe((reason: string) => {
          // Do refresh the milestone
          this.refreshTable(this.jobId);
          this.unsubscribe();
        })
      );

      this.modalRef = this.modalService.show(GeneralConfirmationComponent, {
        class: 'modal-dialog-centered',
        keyboard: false,
        backdrop: 'static',
        initialState: {
          title: 'Transfer Request',
          // tslint:disable-next-line: max-line-length
          data: { message: `Your transfer request for amount ${milestoneAmount} has been received. The process will be completed within 2 or 3 days.`}
        }
      });
    },
    err => {
      this.loading = false;
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }

  checkOngoingMilestone(): void {
    if (this.currentUser$.userType === 'EMPLOYER') {
      // tslint:disable-next-line: max-line-length
      const ongoingMilestone = this.milestones.filter(element => element.statusFromClient === MilestoneStatusClient.OPEN || element.statusFromClient === MilestoneStatusClient.PENDING);
      if (ongoingMilestone.length > 0 || this.jobData.status === JobStatus.CMPL || this.jobData.status === JobStatus.CANC) {
        this.isReadyToComplete = false;
      } else {
        this.isReadyToComplete = true;
      }
    } else if (this.currentUser$.userType === 'FREELANCER') {
      // tslint:disable-next-line: max-line-length
      const pendingTrfRequest = this.milestones.filter(element => element.statusFromClient !== MilestoneStatusClient.CANCELLED && (!element.transferRequest || element.transferRequest === false));
      if (pendingTrfRequest.length > 1) {
        this.workerToRate = false;
      } else {
        this.workerToRate = true;
      }
    }

  }

  goToCompleteJob(): void {

    const workerId = this.jobData.worker;

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        if (!this.modalRef.content.cancelAction) {
          // Do action here to complete the job
          const payload = {
            jobId: this.jobId,
            workerRating: this.modalRef.content.returnData,
            workerId
          };
          // Complete the job and set worker rating
          this.loading = true;
          this.jobService.completeJob(payload).subscribe(data => {
            this.loading = false;
            // Go to completed job route
            this.router.navigate([`jobs/completed`],
            {
              queryParams: {
                job: this.jobId
              }
            });
          },
          err => {
            this.loading = false;
            const errResponse = (err as ServiceErrorResponse);
            this.toastr.error(errResponse.message);
          });

        }
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(GiveratingComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        title: 'Rating for Worker',
        // tslint:disable-next-line: max-line-length
        data: { message: `Please give rating for your worker.`}
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

  isAbleToAdd(): boolean {
    let result = false;
    if (this.jobData.status === JobStatus.ONGO) {
      result = true;
    }
    return result;
  }
}
