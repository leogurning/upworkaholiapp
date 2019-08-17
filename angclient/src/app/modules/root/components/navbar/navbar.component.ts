import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../interfaces/user';
import { GlobalVariables } from '@app/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  qhashid: string;
  currentUser$: User;

  constructor(public authService: AuthService,
              private route: ActivatedRoute,
              public globalVariables: GlobalVariables) {
                // Get the current user login
                this.authService.currentUser.subscribe(x => this.currentUser$ = x);
              }

  ngOnInit() {
    this.route.queryParams.forEach((params: Params) => {
      this.qhashid = params['id'] || '';
    });
  }

}
