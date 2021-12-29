import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ConfigurationLoader } from "../configuration/configuration-loader.service";
import { Message } from 'ng-chat';
import { ChatFilter } from '../models/chatFilter';

@Injectable()
export class ChatService {

  private junoUrl: string;
  private headers: HttpHeaders;

  constructor(private configurationLoader: ConfigurationLoader, private http: HttpClient) {
    this.junoUrl = this.configurationLoader.getConfiguration().junoUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  
  getProfileMessages(profileId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.junoUrl}ProfileMessages/${profileId}`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getChatsByFilter(chatFilter: ChatFilter, pageIndex: string, pageSize: string): Observable<Message[]> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.post<Message[]>(`${this.junoUrl}GetChatsByFilter`, { chatFilter }, { headers: this.headers, params: params })
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
