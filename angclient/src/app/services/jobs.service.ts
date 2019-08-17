import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { map, catchError, retryWhen, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HandlersService } from './handlers.service';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
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

   // Function to save Job data
  saveJob(oBodyparam) {
    return this.httpc.post<any>(`${this.mainapihosturl}/jobs`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to get jobs list based on input search Text
  getJobs(user: string, searchText: string, status?: string) {

    // Add safe, URL encoded search parameter if there is a search term
    const urlParams = new HttpParams()
              .set('searchText', searchText)
              .set('status', status ? status : '');

    this.headerOptions.params = urlParams;

    // Invoke restful api from server to get jobs
    return this.httpc.get<any>(this.mainapihosturl + `/jobs/list/${user}`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to get jobs aggregate list based on input search Text, job Id
  getJobsAggregate(jobId: string, searchText: string, sortBy: string) {

    // Add safe, URL encoded search parameter if there is a search term
    const urlParams = new HttpParams()
              .set('jobId', jobId)
              .set('searchText', searchText)
              .set('sortBy', sortBy);
    this.headerOptions.params = urlParams;

    // Invoke restful api from server to get jobs
    return this.httpc.get<any>(this.mainapihosturl + `/jobs/search`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to get jobs aggregate list based on input search Text, job Id
  getAfterStartJobsAggregate(user: string, jobId: string, searchText: string, status: string, sortBy: string) {

    // Add safe, URL encoded search parameter if there is a search term
    const urlParams = new HttpParams()
              .set('userName', user)
              .set('jobId', jobId)
              .set('searchText', searchText)
              .set('status', status)
              .set('sortBy', sortBy);
    this.headerOptions.params = urlParams;

    // Invoke restful api from server to get jobs
    return this.httpc.get<any>(this.mainapihosturl + `/jobs/searchafterstart`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to get jobs aggregate list based on input search Text, job Id
  freelancerApplyJob(oBodyparam) {
    // Invoke restful api from server to apply jobs
    return this.httpc.put<any>(this.mainapihosturl + `/jobs/apply`, oBodyparam, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to offer jobs to worker
  employerOfferJob(oBodyparam) {
    // Invoke restful api from server to apply jobs
    return this.httpc.put<any>(this.mainapihosturl + `/jobs/offer`, oBodyparam, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to cancel offer jobs to worker
  employerCancelJobOffer(oBodyparam) {
    // Invoke restful api from server to apply jobs
    return this.httpc.put<any>(this.mainapihosturl + `/jobs/canceloffer`, oBodyparam, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to get jobs list based on input search Text
  getJobOffer(user: string, searchText: string, sortBy: string) {

    // Add safe, URL encoded search parameter if there is a search term
    const urlParams = new HttpParams()
              .set('userName', user)
              .set('searchText', searchText)
              .set('sortBy', sortBy);
    this.headerOptions.params = urlParams;

    // Invoke restful api from server to get jobs
    return this.httpc.get<any>(this.mainapihosturl + `/jobs/offer`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to confirm job offer
  workerConfirmJobOffer(oBodyparam) {
    // Invoke restful api from server to apply jobs
    return this.httpc.put<any>(this.mainapihosturl + `/jobs/confirmoffer`, oBodyparam, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to start job offer
  startJob(oBodyparam) {
    // Invoke restful api from server to apply jobs
    return this.httpc.put<any>(this.mainapihosturl + `/jobs/start`, oBodyparam, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to set client rating
  setClientRating(oBodyparam) {
    // Invoke restful api from server to apply jobs
    return this.httpc.put<any>(this.mainapihosturl + `/jobs/setclientrating`, oBodyparam, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to complete job
  completeJob(oBodyparam) {
    // Invoke restful api from server to apply jobs
    return this.httpc.put<any>(this.mainapihosturl + `/jobs/complete`, oBodyparam, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }
}
