import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalVariables } from '@app/common/variables';
import { FreelancerService } from '../../../../services/freelancer.service';
import { GlobalFunctions } from '@app/common';

@Component({
  selector: 'app-viewfreelancer',
  templateUrl: './viewfreelancer.component.html',
  styleUrls: ['./viewfreelancer.component.css']
})
export class ViewfreelancerComponent implements OnInit, OnDestroy {
  freelancerId: string;
  private sub: Subscription;
  loading = false;
  freelancer;
  isAvailable = 'Available';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public globalVariables: GlobalVariables,
    private freelancerService: FreelancerService,
    public globalFunctions: GlobalFunctions
  ) { }

  ngOnInit() {
    this.globalVariables.showNavbar = false;
    this.sub = this.route.params.subscribe(
      params => {
        this.freelancerId = params['id'];
        this.loading = true;
        this.freelancerService.getFreelancerProfile(this.freelancerId).subscribe(data => {
          this.loading = false;
          this.freelancer = data;
          if (data.isAvailable) { this.isAvailable = 'Available';
          } else { this.isAvailable = 'Not Available'; }
        },
        err => {
          this.loading = false;
        });
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getRatingStars(rating?: number): string {
    let result = '0';
    result = this.globalFunctions.getRatingPercentage(rating);
    return result;
  }
}
