import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';
import { map, catchError, retryWhen, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HandlersService } from './handlers.service';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  private mainapihosturl = environment.mainApiHostUrl;
  private headerOptions;

  constructor(
    private httpc: HttpClient,
    private handlerService: HandlersService
  ) {
    // Set header information
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    this.headerOptions = { headers: headers,
      observe: 'body', };
  }

  // Function to save freelancer profile
  saveFreelancerProfile(oBodyparam) {
    return this.httpc.post<any>(`${this.mainapihosturl}/profile/freelancer`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to get freelancer profile based on input username
  getFreelancerProfile(userName) {
    // Invoke restful api from server to get profile
    return this.httpc.get<any>(this.mainapihosturl + `/profile/freelancer/${userName}`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to change profile photo
  changeProfilePhoto(oBodyParam) {
    // Invoke restful api from server to change profile photo
    return this.httpc.put<any>(this.mainapihosturl + `/profile/freelancer`, oBodyParam)
    .pipe(map((response) => {
      return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to save freelancer profile
  saveEmployerProfile(oBodyparam) {
    return this.httpc.post<any>(`${this.mainapihosturl}/profile/employer`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to get freelancer profile based on input username
  getEmployerProfile(userName) {
    // Invoke restful api from server to get profile
    return this.httpc.get<any>(this.mainapihosturl + `/profile/employer/${userName}`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to change profile photo
  changeEmployerProfilePhoto(oBodyParam) {
    // Invoke restful api from server to change profile photo
    return this.httpc.put<any>(this.mainapihosturl + `/profile/employer`, oBodyParam)
    .pipe(map((response) => {
      return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to get freelancer profile based on input username
  getEmployerDashboard(userName: string) {
    // Invoke restful api from server to get profile
    return this.httpc.get<any>(this.mainapihosturl + `/profile/employerdashboard/${userName}`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to get freelancer profile based on input username
  getFreelancerDashboard(userName: string) {
    // Invoke restful api from server to get profile
    return this.httpc.get<any>(this.mainapihosturl + `/profile/freelancerdashboard/${userName}`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }
}
