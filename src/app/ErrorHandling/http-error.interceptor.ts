import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// https://rollbar.com/blog/error-handling-with-angular-8-tips-and-best-practices/

export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        retry(3),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';

          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            //errorMessage = `An error occurred: ${error.error.message}`;
            //console.error('An error occurred:', error.error.message);
          } else if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            //errorMessage = `No connection to data server: ${error.error}`;
            //console.error('No connection to data server:', error.error);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            //errorMessage = 
            //  `Backend returned code ${error.status}, ` +
            //  `body was: ${error.error}`;
            //console.error(
            //  `Backend returned code ${error.status}, ` +
            //  `body was: ${error.error}`);
          }

          //window.alert(errorMessage); // Log errorMessage somewhere.
          return throwError(error);
        })
      )
  }
}
