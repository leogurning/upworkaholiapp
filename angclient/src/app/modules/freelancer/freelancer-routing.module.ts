import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { SearchfreelancerComponent } from './components/searchfreelancer/searchfreelancer.component';
import { ViewfreelancerComponent } from './components/viewfreelancer/viewfreelancer.component';

const appRoutes: Routes = [
  {path: '', component: SearchfreelancerComponent, canActivate: [AuthGuard]},
  {path: 'view/:id', component: ViewfreelancerComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FreelancerRoutingModule { }
