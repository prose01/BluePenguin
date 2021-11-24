import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ConfigurationLoader } from '../configuration/configuration-loader.service';
import { ImageSizeEnum } from '../models/imageSizeEnum';

@Injectable()
export class ImageService {

  private artemisUrl: string;
  private headers: HttpHeaders;

  constructor(private configurationLoader: ConfigurationLoader, private http: HttpClient) {
    this.artemisUrl = configurationLoader.getConfiguration().artemisUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  // CurrentUser

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.artemisUrl}UploadImage`, formData, {
      observe: 'events'
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  //getImageByFileName(fileName: string): Observable<any[]> {
  //  return this.http.get<any[]>(`${this.artemisUrl}GetImageByFileName/${fileName}`, { headers: this.headers })
  //    .pipe(
  //      retry(3),
  //      catchError(this.handleError)
  //    );
  //}

  deleteImagesForCurrentUser(imageId: string[]) {
    return this.http.post(`${this.artemisUrl}DeleteImagesForCurrentUser`, imageId, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
    ).toPromise();
  }

  deleteAllImagesForCurrentUser() {
    return this.http.post(`${this.artemisUrl}DeleteAllImagesForCurrentUser`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
    ).toPromise();
  }

  // Profile

  //getProfileImages(profileId: string, size: ImageSizeEnum): Observable<any[]> {
  //  return this.http.get<any[]>(`${this.artemisUrl}GetProfileImages/${profileId},${size}`, { headers: this.headers })
  //    .pipe(
  //      retry(3),
  //      catchError(this.handleError)
  //    );
  //}

  getProfileImageByFileName(profileId: string, fileName: string, size: ImageSizeEnum): Observable<any[]> {
    return this.http.get<any[]>(`${this.artemisUrl}GetProfileImageByFileName/${profileId},${fileName},${size}`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  deleteAllImagesForProfile(profileIds: string[]): Observable<any> {
    return this.http.post(`${this.artemisUrl}DeleteAllImagesForProfile`, profileIds, { headers: this.headers })
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
    //  console.error('No connection to image server:', error.error);
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
