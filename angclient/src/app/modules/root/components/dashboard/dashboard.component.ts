import { Component, OnInit } from '@angular/core';
import { ToastrService } from '../../../../common/toastr.service';
import { AuthService } from '../../../../services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { User } from '../../../../interfaces/user';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ProfileService } from '../../../../services/profile.service';
import * as moment from 'moment';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GlobalFunctions } from '@app/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser$: User;
  dashboardData;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  constructor(
      public authenticationService: AuthService,
      private profileService: ProfileService,
      private router: Router,
      private route: ActivatedRoute,
      private toastr: ToastrService,
      private modalService: BsModalService,
      public globalFunctions: GlobalFunctions
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser$ = x);
  }

  ngOnInit() {
    // Get user dashboard
    this.loading = true;
    if (this.currentUser$.userType === 'EMPLOYER') {
      // Employer dashboard
      this.profileService.getEmployerDashboard(this.currentUser$.userName).subscribe(data => {
        this.loading = false;
        this.dashboardData = data;
      },
      err => {
        this.loading = false;
        const errResponse = (err as ServiceErrorResponse);
        this.toastr.error(errResponse.message);
      });
    } else if (this.currentUser$.userType === 'FREELANCER') {
      // Worker dashboard
      this.profileService.getFreelancerDashboard(this.currentUser$.userName).subscribe(data => {
        this.loading = false;
        this.dashboardData = data;
      },
      err => {
        this.loading = false;
        const errResponse = (err as ServiceErrorResponse);
        this.toastr.error(errResponse.message);
      });
    }
  }

  getRatingStars(rating?: number): string {
    let result = '0';
    result = this.globalFunctions.getRatingPercentage(rating);
    return result;
  }
}
