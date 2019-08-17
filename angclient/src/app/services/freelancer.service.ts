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
export class FreelancerService {
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

  // Function to get freelancers profile based on input search Text
  getFreelancers(searchText: string) {

    // Add safe, URL encoded search parameter if there is a search term
    const urlParams = new HttpParams()
              .set('searchText', searchText);
    this.headerOptions.params = urlParams;

    // Invoke restful api from server to get freelancers
    return this.httpc.get<any>(this.mainapihosturl + `/freelancers`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to get freelancers profile based on input search Text
  getFreelancerProfile(id: string) {
    // Invoke restful api from server to get freelancers
    return this.httpc.get<any>(this.mainapihosturl + `/freelancers/detail/${id}`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }

  // Function to get freelancers profile based on input search Text
  getFreelancerList(searchText: string, userList: any) {

    // Add safe, URL encoded search parameter if there is a search term
    const urlParams = new HttpParams()
              .set('searchText', searchText);
    this.headerOptions.params = urlParams;

    // Invoke restful api from server to get freelancers
    return this.httpc.post<any>(this.mainapihosturl + `/freelancers/list`, userList, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      catchError(this.handlerService.handleError));
  }
}
