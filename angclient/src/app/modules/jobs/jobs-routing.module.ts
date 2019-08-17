import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { ListjobsComponent } from './components/listjobs/listjobs.component';
import { SearchjobComponent } from './components/searchjob/searchjob.component';
import { ManagejobsComponent } from './components/managejobs/managejobs.component';
import { ListjobofferComponent } from './components/listjoboffer/listjoboffer.component';
import { OngoingjobsComponent } from './components/ongoingjobs/ongoingjobs.component';
import { SetmilestoneComponent } from './components/setmilestone/setmilestone.component';
import { CompletedjobsComponent } from './components/completedjobs/completedjobs.component';

const appRoutes: Routes = [
  {path: '', component: ListjobsComponent, canActivate: [AuthGuard]},
  {path: 'search', component: SearchjobComponent, canActivate: [AuthGuard]},
  {path: 'manage/:id', component: ManagejobsComponent, canActivate: [AuthGuard]},
  {path: 'offer', component: ListjobofferComponent, canActivate: [AuthGuard]},
  {path: 'ongoing', component: OngoingjobsComponent, canActivate: [AuthGuard]},
  {path: 'completed', component: CompletedjobsComponent, canActivate: [AuthGuard]},
  {path: 'setmilestone/:id', component: SetmilestoneComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class JobsRoutingModule { }
