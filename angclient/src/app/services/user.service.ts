import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
import { map, catchError, retryWhen, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HandlersService } from './handlers.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public jwtToken: string;
  private mainapihosturl = environment.mainApiHostUrl;
  private headerOptions;

  constructor(private http: Http,
    private httpc: HttpClient,
    private handlerService: HandlersService) {

    const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
    if (theUser) {
      this.jwtToken = theUser.token;
    }
    // Set header information
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    this.headerOptions = { headers: headers,
      observe: 'body', };
  }

  registerUser(oBodyparam) {
    return this.httpc.post<any>(`${this.mainapihosturl}/user/register`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to get email verification with input hash in url parameters
  doEmailVerification(hash) {
    // Add safe, URL encoded search parameter if there is a search term
    const urlParams = new HttpParams()
              .set('id', hash);
    this.headerOptions.params = urlParams;

    // Invoke restful api from server to get forecast items
    return this.httpc.get<any>(this.mainapihosturl + `/user/emailverification`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      retryWhen(this.handlerService.handleRetry),
      catchError(this.handlerService.handleError));
  }

  doSendResetPassword(oBodyparam) {
    return this.httpc.post<any>(`${this.mainapihosturl}/user/sendresetpwd`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  // Function to get page verification with input hash in url parameters
  doPageVerification(hash) {

    // Add safe, URL encoded search parameter if there is a search term
    const urlParams = new HttpParams()
              .set('id', hash);
    this.headerOptions.params = urlParams;

    // Invoke restful api from server to get forecast items
    return this.httpc.get<any>(this.mainapihosturl + `/user/pageverification`, <Object>this.headerOptions)
      .pipe(map((response) => {
        return response;
      }),
      retryWhen(this.handlerService.handleRetry),
      catchError(this.handlerService.handleError));
  }

  doGetUser(userName) {

    return this.httpc.get<any>(this.mainapihosturl + `/user/${userName}`, <Object>this.headerOptions)
      .pipe(map((response) => response),
      catchError(this.handlerService.handleError));
  }

  doResetPassword(oBodyparam) {
    return this.httpc.post<any>(`${this.mainapihosturl}/user/resetpassword`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  doChangeEmail(oBodyparam) {
    return this.httpc.put<any>(`${this.mainapihosturl}/user/editemail`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  doUpdatePassword(userName, oBodyparam) {
    return this.httpc.put<any>(`${this.mainapihosturl}/user/changepassword/${userName}`, oBodyparam, <Object>this.headerOptions)
    .pipe(map((response) => {
        return response;
    }),
    catchError(this.handlerService.handleError));
  }

  registerClient(oUser) {
    const headers = new Headers ({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
     return this.http.post(this.mainapihosturl + 'registerClient', JSON.stringify(oUser), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  recvemailverification(hash) {
    const headers = new Headers ({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
     return this.http.get(this.mainapihosturl + `rcvemailverification?id=${hash}`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  pageverification(hash) {
    const headers = new Headers ({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
     return this.http.get(this.mainapihosturl + `pgverification?id=${hash}`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  sendResetPassword(oBodyparam) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `sendresetpwd`, JSON.stringify(oBodyparam), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  resetPassword(oBodyparam) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `resetpassword`, JSON.stringify(oBodyparam), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  getUser(userid) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.mainapihosturl + `user/${userid}`, options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  updateUser(userid, oUser) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `user/${userid}`, JSON.stringify(oUser), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  updatePhoto(userid, oUser) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `userphoto/${userid}`, JSON.stringify(oUser), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  updatePassword(userid, oUser) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `password/${userid}`, JSON.stringify(oUser), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  getUserAddressAgg(userid, oUser) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `listagguseraddress/${userid}`, JSON.stringify(oUser), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  saveUserAddress(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `useraddress/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  updateUserAddress(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `useraddress/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  deleteUserAddress(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `deluseraddress/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getUserAddress(addressid) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.mainapihosturl + `useraddress/${addressid}`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getUserContactnoAgg(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `listaggusercontactno/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  saveUserContactno(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `usercontactno/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));

  }

  getUserContactno(contactid) {

     const headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization', `${this.jwtToken}`);
     const options = new RequestOptions({ headers: headers });

     return this.http.get(this.mainapihosturl + `usercontactno/${contactid}`, options)
         .pipe(map((response: Response) => response.json()),
         catchError(this.handleError));
   }

   updateUserContactno(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `usercontactno/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  deleteUserContactno(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `delusercontactno/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  changeUserphoto(userid, oBodyparam) {

      const headers = new Headers();
      headers.append('Authorization', `${this.jwtToken}`);
      const options = new RequestOptions({ headers: headers });

      return this.http.post(`${this.mainapihosturl}changeuserphoto/${userid}`, oBodyparam, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  private handleError(error: Response) {
    const stdErrMsg = `Ooops sorry...a server error occured. Please try again shortly. <br>`;
    const errMsg = error.status ? `${stdErrMsg} ${'Error: &nbsp;' + error.status} - ${error.statusText}` : stdErrMsg;

    return throwError(errMsg);
  }
}
