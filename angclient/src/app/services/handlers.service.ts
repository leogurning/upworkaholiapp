import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceErrorResponse } from './../interfaces/service-response';
import { throwError, Observable } from 'rxjs';
import { scan, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HandlersService {

  constructor() { }

  // Shared service function to handle Error and retry
  // take an error and return a structured ServiceErrorResponse via throwing an exception
  handleError(httpResponse: HttpErrorResponse) {

    const response: ServiceErrorResponse = {
        message: `Ooops sorry...an error occured. Please try again shortly.`,
        raw: '',
        error: 0
    };

    // handle time out error
    if (String(httpResponse.name) === 'TimeoutError') {
      response.message = 'Timeout has occurred';
      response.error = httpResponse.status;
      response.raw = httpResponse.message;
    } else if (httpResponse.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', httpResponse.error.message);
      response.message = 'a client side error occured';
      response.error = httpResponse.status;
      response.raw = httpResponse.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,

      if (httpResponse instanceof HttpErrorResponse) {
        console.error(
          `Backend returned code ${httpResponse.status}, ` +
          `body was: ${JSON.stringify(httpResponse.error)}`);
      }
        // httpResponse.message has a value like "Http failure response for http://localhost:5000/api/msconfig/date/list: 0 Unknown Error"

      response.message = httpResponse instanceof HttpErrorResponse ?
        'a server error occured. Please try again later.' : httpResponse;
      response.raw = httpResponse.message;
      response.error = httpResponse.status;

    }

    // return an observable with a user-facing error message
    return throwError(response);

  }

  handleRetry(error: Observable<any>) {
    console.log('error');
    return error
    .pipe(scan((retryCount) => {
      retryCount += 1;
      if (retryCount < 3) {
        console.log(`Retry Attempt: ${retryCount}`);
        return retryCount;
      } else {
        // tslint:disable-next-line: max-line-length
        throw new HttpErrorResponse({ error: 'Server Error/Disconnected. Please try again later', status: 500 });
      }
    }, 0), delay(1000));
  }
}
