import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from '../../../../common/toastr.service';
import * as moment from 'moment';
import { User } from '../../../../interfaces/user';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { JobsService } from '../../../../services/jobs.service';
import { GlobalFunctions } from '@app/common';

@Component({
  selector: 'app-viewjobdetails',
  templateUrl: './viewjobdetails.component.html',
  styleUrls: ['./viewjobdetails.component.css']
})
export class ViewjobdetailsComponent implements OnInit {
  modalTitle: string;
  user: User;
  data;
  isApplied: boolean;
  cancelAction = true;
  loading = false;

  constructor(
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private jobService: JobsService,
    public globalFunctions: GlobalFunctions
  ) { }

  ngOnInit() {
    this.modalTitle = 'Job Details';
  }

  cancelModal(): void {
    this.cancelAction = true;
    this.modalRef.hide();
  }

  applyJob(jobId): void {
    // Create payload for the api service
    const payload = {
      jobId,
      userName: this.user.userName
    };
    // Update the Job Data
    this.loading = true;
    this.jobService.freelancerApplyJob(payload).subscribe(data => {
      this.loading = false;
      this.cancelAction = false;
      this.toastr.success('Apply job successfully');
      this.modalRef.hide();
    },
    err => {
      this.loading = false;
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }

  getRatingStars(rating: number): string {
    let result = '0';
    result = this.globalFunctions.getRatingPercentage(rating);
    return result;
  }
}
