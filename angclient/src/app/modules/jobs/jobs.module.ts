import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared/shared.module';
import { JobsRoutingModule } from './jobs-routing.module';
import { ListjobsComponent } from './components/listjobs/listjobs.component';
import { SavejobsComponent } from './components/savejobs/savejobs.component';
import { SearchjobComponent } from './components/searchjob/searchjob.component';
import { ViewjobdetailsComponent } from './components/viewjobdetails/viewjobdetails.component';
import { ManagejobsComponent } from './components/managejobs/managejobs.component';
import { ListjobofferComponent } from './components/listjoboffer/listjoboffer.component';
import { OngoingjobsComponent } from './components/ongoingjobs/ongoingjobs.component';
import { SetmilestoneComponent } from './components/setmilestone/setmilestone.component';
import { SavemilestoneComponent } from './components/savemilestone/savemilestone.component';
import { WorkerupdatesComponent } from './components/workerupdates/workerupdates.component';
import { CompletedjobsComponent } from './components/completedjobs/completedjobs.component';

@NgModule({
  declarations: [
    ListjobsComponent,
    SavejobsComponent,
    SearchjobComponent,
    ViewjobdetailsComponent,
    ManagejobsComponent,
    ListjobofferComponent,
    OngoingjobsComponent,
    SetmilestoneComponent,
    SavemilestoneComponent,
    WorkerupdatesComponent,
    CompletedjobsComponent
  ],
  imports: [
    JobsRoutingModule,
    SharedModule
  ],
  entryComponents: [
    SavejobsComponent,
    ViewjobdetailsComponent,
    SavemilestoneComponent,
    WorkerupdatesComponent
  ]
})
export class JobsModule { }
