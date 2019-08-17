import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { DisablecontrolDirective } from '../../directives/disablecontrol.directive';
import { GeneralConfirmationComponent } from './components/general-confirmation/general-confirmation.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalviewfreelancerComponent } from './components/modalviewfreelancer/modalviewfreelancer.component';
import { GeneralYesnoConfirmationComponent } from './components/general-yesno-confirmation/general-yesno-confirmation.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { GiveratingComponent } from './components/giverating/giverating.component';
import { RatingComponent } from './components/rating/rating.component';

@NgModule({
  declarations: [
    DisablecontrolDirective,
    GeneralConfirmationComponent,
    ModalviewfreelancerComponent,
    GeneralYesnoConfirmationComponent,
    GiveratingComponent,
    RatingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      fullScreenBackdrop: false,
      primaryColour: '#ff3333',
      secondaryColour: '#ff3333',
      tertiaryColour: '#ff3333'
    }),
    PaginationModule.forRoot(),
    TooltipModule.forRoot()
  ],
  entryComponents: [
    GeneralConfirmationComponent,
    ModalviewfreelancerComponent,
    GeneralYesnoConfirmationComponent,
    GiveratingComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NgxLoadingModule,
    BsDatepickerModule,
    DisablecontrolDirective,
    GeneralConfirmationComponent,
    PaginationModule,
    GeneralYesnoConfirmationComponent,
    TooltipModule,
    GiveratingComponent
  ]
})
export class SharedModule {

}
