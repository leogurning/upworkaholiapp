import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* common Modules */
import { ToastrService } from './common/toastr.service';
import { DatePipe } from '@angular/common';
import { GlobalVariables, GlobalFunctions } from './common/variables';

/* Root Modules */
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/root/components/home/home.component';
import { NavbarComponent } from './modules/root/components/navbar/navbar.component';
import { FooterComponent } from './modules/root/components/footer/footer.component';
import { ErrorpageComponent } from './modules/root/components/errorpage/errorpage.component';
import { PagenotfoundComponent } from './modules/root/components/pagenotfound/pagenotfound.component';
import { LoginComponent } from './modules/root/components/login/login.component';
import { DashboardComponent } from './modules/root/components/dashboard/dashboard.component';
import { LogoutComponent } from './modules/root/components/logout.component';
import { EmailverificationComponent } from './modules/root/components/emailverification/emailverification.component';
import { RegisterclientComponent } from './modules/root/components/registerclient/registerclient.component';
import { ForgetpasswordComponent } from './modules/root/components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './modules/root/components/resetpassword/resetpassword.component';

/* Root routing module */
import { AppRoutingModule } from './app-routing.module';

/* Feature Modules */
/* This should not be referenced because it's lazy module
import { UserModule } from './modules/user/user.module';
import { ClientmgtModule } from './modules/clientmgt/clientmgt.module';
*/

/* Shared Angular Modules */
import { SharedModule } from './modules/shared/shared.module';

/* Services Modules */
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ProfileService } from './services/profile.service';
import { AuthGuard } from './guards/auth.guard';
import { FiletransferService } from './services/filetransfer.service';
import { ClientsService } from './services/clients.service';
import { FreelancerService } from './services/freelancer.service';

/* Interceptors Modules */
import { httpInterceptorProviders } from './http-interceptors/index';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ErrorpageComponent,
    PagenotfoundComponent,
    LoginComponent,
    DashboardComponent,
    LogoutComponent,
    EmailverificationComponent,
    RegisterclientComponent,
    ForgetpasswordComponent,
    ResetpasswordComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    /* This should not be referenced because it's lazy module
    UserModule,
    ClientmgtModule,
    */
    /* Root Routing Module . IMPORTANT: Must be after Feature module because there is
    wild card path for pagenotfound component. */
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    DatePipe,
    ToastrService,
    AuthService,
    AuthGuard,
    UserService,
    FiletransferService,
    ClientsService,
    httpInterceptorProviders,
    ProfileService,
    FreelancerService,
    GlobalVariables,
    GlobalFunctions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
