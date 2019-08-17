import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from '../../../../common/toastr.service';
import * as moment from 'moment';
import { User } from '../../../../interfaces/user';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { MilestonesService } from '../../../../services/milestones.service';
import { MilestoneStatusWorker, MilestoneStatusClient } from '@app/common/variables';

@Component({
  selector: 'app-workerupdates',
  templateUrl: './workerupdates.component.html',
  styleUrls: ['./workerupdates.component.css']
})
export class WorkerupdatesComponent implements OnInit, AfterViewInit {
  modalTitle: string;
  user: User;
  data;
  cancelAction = false;
  inputForm: FormGroup;
  disabledWorkerControl = false;
  disabledClientControl = false;

  loading = false;
  @ViewChild('inputWorkUpdatesRef') inputWorkUpdatesElementRef: ElementRef;
  @ViewChild('inputClientFeedbackRef') inputClientFeedbackElementRef: ElementRef;

  statusFromWorkerList = [
    { displayValue: MilestoneStatusWorker.INPROGRESS },
    { displayValue: MilestoneStatusWorker.COMPLETED },
  ];

  statusFromClientList = [
    { displayValue: MilestoneStatusClient.OPEN },
    { displayValue: MilestoneStatusClient.PENDING },
    { displayValue: MilestoneStatusClient.APPROVED },
    { displayValue: MilestoneStatusClient.CANCELLED },
  ];

  constructor(
    private fb: FormBuilder,
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private milestoneService: MilestonesService,
  ) { }

  workerUpdates = new FormControl('', [Validators.required]);
  statusFromWorker = new FormControl('', [Validators.required]);
  clientFeedback = new FormControl('', [Validators.required]);
  statusFromClient = new FormControl('', [Validators.required]);

  ngOnInit() {

    this.modalTitle = 'Updates';

    if (this.user.userType === 'FREELANCER') {
      this.disabledWorkerControl = true;
      this.disabledClientControl = false;

      this.inputForm = this.fb.group({
        workerUpdates: this.workerUpdates,
        statusFromWorker: this.statusFromWorker,
      });
    } else if (this.user.userType === 'EMPLOYER') {
      this.disabledWorkerControl = false;
      this.disabledClientControl = true;

      this.inputForm = this.fb.group({
        clientFeedback: this.clientFeedback,
        statusFromClient: this.statusFromClient
      });
    }

    this.populateForm(this.data.milestone);
  }

  ngAfterViewInit() {
    if (this.user.userType === 'FREELANCER') {
      setTimeout(() => {
        this.inputWorkUpdatesElementRef.nativeElement.focus();
      }, 300);
    } else if (this.user.userType === 'EMPLOYER') {
      setTimeout(() => {
        this.inputClientFeedbackElementRef.nativeElement.focus();
      }, 300);
    }
  }

  populateForm(dataArray): void {
    const updateToDisplay = dataArray;
    // Condition edit data
    if (this.user.userType === 'FREELANCER') {
      if (updateToDisplay.statusFromWorker !== MilestoneStatusWorker.NOTSTARTED) {
        this.inputForm.patchValue({
          workerUpdates: updateToDisplay.workerUpdates,
          statusFromWorker: updateToDisplay.statusFromWorker,
        });
      } else {
        // Condition if the add action is from the add button above the timeline.
        // set the initial data of dimension1, 2, firstNight and lastNight
        this.inputForm.patchValue({
          workerUpdates: updateToDisplay.workerUpdates,
          statusFromWorker: this.statusFromWorkerList[0].displayValue,
        });
      }
    } else if (this.user.userType === 'EMPLOYER') {
        this.inputForm.patchValue({
          clientFeedback: updateToDisplay.clientFeedback,
          statusFromClient: updateToDisplay.statusFromClient,
        });
    }
  }

  saveMilestone(formdata): void {
    // Check the form dirty and validity
    if (this.inputForm.dirty && this.inputForm.valid) {
      formdata.milestoneId = this.data.milestone._id;
      if (this.user.userType === 'FREELANCER') {
        // Condition is the user is worker
        // Save the Milestone Data
        this.loading = true;
        this.milestoneService.workerUpdates(formdata).subscribe(data => {
          this.loading = false;
          this.toastr.success('Updates data is saved successfully');
          this.modalRef.hide();
        },
        err => {
          this.loading = false;
          const errResponse = (err as ServiceErrorResponse);
          this.toastr.error(errResponse.message);
        });
      } else if (this.user.userType === 'EMPLOYER') {
        // Condition is the user is client
        // Save the Milestone Data
        this.loading = true;
        this.milestoneService.clientFeedback(formdata).subscribe(data => {
          this.loading = false;
          this.toastr.success('Updates data is saved successfully');
          this.modalRef.hide();
        },
        err => {
          this.loading = false;
          const errResponse = (err as ServiceErrorResponse);
          this.toastr.error(errResponse.message);
        });
      }
    }
  }

  cancelModal(): void {
    this.cancelAction = true;
    this.modalRef.hide();
  }

}
