import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { ServiceErrorResponse } from '../../../../interfaces/service-response';

@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.css']
})
export class EmailverificationComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  loading = true;

  userName: string;
  email: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService ) { }

  ngOnInit() {
    this.loading = true;
    this.sub = this.route.queryParams.subscribe(
      params => {
        const hash = params['id'];
        this.userService.doEmailVerification(hash)
        .subscribe(data => {
            this.loading = false;
            this.userName = data.userName;
            this.email = data.email;
        },
        err => {
          this.loading = false;
          this.router.navigate(['/errorpage']);
          const errResponse = (err as ServiceErrorResponse);
          this.toastr.error(errResponse.message);
        });
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
