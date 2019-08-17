import { NgModule } from '@angular/core';
import { SearchfreelancerComponent } from './components/searchfreelancer/searchfreelancer.component';
import { SharedModule } from '../../modules/shared/shared.module';
import { FreelancerRoutingModule } from './freelancer-routing.module';
import { ViewfreelancerComponent } from './components/viewfreelancer/viewfreelancer.component';

@NgModule({
  declarations: [
    SearchfreelancerComponent,
    ViewfreelancerComponent,
  ],
  imports: [
    FreelancerRoutingModule,
    SharedModule,
  ],
  entryComponents: [
  ]
})
export class FreelancerModule { }
