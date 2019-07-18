import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { PasswordComponent } from './components/password/password.component';

import { SharedModule } from '../../modules/shared/shared.module';
// import { AdduseraddressComponent } from './components/adduseraddress/adduseraddress.component';
import { AccountComponent } from './components/account/account.component';

@NgModule({
  declarations: [
    PasswordComponent,
    // AdduseraddressComponent,
    AccountComponent
  ],
  imports: [
    UserRoutingModule,
    SharedModule
  ],
  entryComponents: [
    // AdduseraddressComponent,
  ]
})
export class UserModule { }
