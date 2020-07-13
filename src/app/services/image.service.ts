import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CurrentUser } from '../models/currentUser';

@Injectable()
export class ImageService {

  private artemisUrl = 'https://localhost:44378/';  // URL to web api
  private headers: HttpHeaders;

  retrievedImage: any; // Is this being used?
  base64Data: any; // Is this being used?
  retrieveResonse: any; // Is this being used?

  constructor(private http: HttpClient, public router: Router) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }


  // CurrentUser

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.artemisUrl}UploadImage`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getImageByFileName(fileName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.artemisUrl}GetImageByFileName/${fileName}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteImage(imageId: string[]): Observable<CurrentUser> {
    return this.http.post(`${this.artemisUrl}DeleteImage`, imageId, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Profile

  getProfileImages(profileId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.artemisUrl}GetProfileImages/${profileId}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getProfileImageByFileName(profileId: string, fileName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.artemisUrl}GetProfileImageByFileName/${profileId},${fileName}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Helper Lav en rigtig error handler inden produktion
  // https://stackblitz.com/angular/jyrxkavlvap?file=src%2Fapp%2Fheroes%2Fheroes.service.ts
  // Husk at opdater GET, POST etc this.handleError!
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
