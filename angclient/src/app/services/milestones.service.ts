import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { map, catchError, retryWhen, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HandlersService } from './handlers.service';

@Injectable({
  providedIn: 'root'
})
export class MilestonesService {
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

  // Function to save Milestone data
  saveMilestone(oBodyparam) {
    return this.httpc.post<any>(`${this.mainapihosturl}/milestones`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to get milestone list based on input search Text
  getMilestone(jobId: string, status?: string) {

    // Add safe, URL encoded search parameter if there is a search term
    const urlParams = new HttpParams()
              .set('jobId', jobId)
              .set('status', status ? status : '');

    this.headerOptions.params = urlParams;

    // Invoke restful api from server to get milestone
    return this.httpc.get<any>(this.mainapihosturl + `/milestones/list`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to save worker updates
  workerUpdates(oBodyparam) {
    return this.httpc.put<any>(`${this.mainapihosturl}/milestones/workerupdates`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to save client feedback
  clientFeedback(oBodyparam) {
    return this.httpc.put<any>(`${this.mainapihosturl}/milestones/clientfeedback`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to save transfer request
  requestForTransfer(oBodyparam) {
    return this.httpc.put<any>(`${this.mainapihosturl}/milestones/requestfortransfer`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }
}
