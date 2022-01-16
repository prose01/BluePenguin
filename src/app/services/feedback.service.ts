import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Feedback } from '../models/feedback';
import { FeedbackFilter } from '../models/feedbackFilter';
import { ConfigurationLoader } from "../configuration/configuration-loader.service";

@Injectable()
export class FeedBackService {

  private avalonUrl: string;
  private headers: HttpHeaders;

  constructor(private configurationLoader: ConfigurationLoader, private http: HttpClient) {
    this.avalonUrl = this.configurationLoader.getConfiguration().avalonUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  addFeedback(feedback: Feedback): Observable<{}> {
    return this.http.post<Feedback>(`${this.avalonUrl}AddFeedback`, feedback, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  openFeedbacks(feedbackIds: String[]): Observable<{}> {
    return this.http.post<Feedback>(`${this.avalonUrl}OpenFeedbacks`, feedbackIds, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  closeFeedbacks(feedbackIds: String[]): Observable<{}> {
    return this.http.post<Feedback>(`${this.avalonUrl}CloseFeedbacks`, feedbackIds, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getUnassignedFeedbacks(countrycode: string, languagecode: string): Observable<Feedback[]> {
    const params = new HttpParams()
      .set('Countrycode', countrycode)
      .set('Languagecode', languagecode);

    return this.http.get<Feedback[]>(`${this.avalonUrl}GetUnassignedFeedbacks`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  assignFeedbackToAdmin(feedbackIds: Feedback[]): Observable<{}> {
    return this.http.post<Feedback>(`${this.avalonUrl}AssignFeedbackToAdmin`, feedbackIds, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getFeedbacksByFilter(feedbackFilter: FeedbackFilter): Observable<Feedback[]> {
    return this.http.post<Feedback[]>(`${this.avalonUrl}GetFeedbacksByFilter`, { feedbackFilter }, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }


  // Helper Lav en rigtig error handler inden produktion
  // https://stackblitz.com/angular/jyrxkavlvap?file=src%2Fapp%2Fheroes%2Fheroes.service.ts
  // Husk at opdater GET, POST etc this.handleError!
  //private handleError(error: any): Promise<any> {
  //  console.error('An error occurred', error); // for demo purposes only
  //  return Promise.reject(error.message || error);
  //}

  private handleError(error: HttpErrorResponse) {
    //if (error.error instanceof ErrorEvent) {
    //  // A client-side or network error occurred. Handle it accordingly.
    //  console.error('An error occurred:', error.error.message);
    //} else if (error.status === 0) {
    //  // A client-side or network error occurred. Handle it accordingly.
    //  console.error('No connection to data server:', error.error);
    //} else {
    //  // The backend returned an unsuccessful response code.
    //  // The response body may contain clues as to what went wrong.
    //  console.error(
    //    `Backend returned code ${error.status}, ` +
    //    `body was: ${error.error}`);
    //}
    // Return an observable with a user-facing error message.
    return throwError(
      error
      //'Something bad happened; please try again later.'
    );
  }
}
