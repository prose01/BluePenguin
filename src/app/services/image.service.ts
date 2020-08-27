import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CurrentUser } from '../models/currentUser';
import { AppSettings } from '../models/appsettings';
import { AppSettingsService } from './appsettings.service';

@Injectable()
export class ImageService {

  private settings: AppSettings;
  private headers: HttpHeaders;

  //retrievedImage: any; // Is this being used?
  //base64Data: any; // Is this being used?
  //retrieveResonse: any; // Is this being used?

  constructor(private appSettingsService: AppSettingsService, private http: HttpClient, public router: Router) {
    this.appSettingsService.getSettings().subscribe(settings => this.settings = settings);
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  // CurrentUser

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.settings.artemisUrl}UploadImage`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getImageByFileName(fileName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.settings.artemisUrl}GetImageByFileName/${fileName}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteImage(imageId: string[]): Observable<CurrentUser> {
    return this.http.post(`${this.settings.artemisUrl}DeleteImage`, imageId, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAllImagesForCurrentUser(): Observable<CurrentUser> {
    return this.http.post(`${this.settings.artemisUrl}DeleteAllImagesForCurrentUser`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Profile

  getProfileImages(profileId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.settings.artemisUrl}GetProfileImages/${profileId}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getProfileImageByFileName(profileId: string, fileName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.settings.artemisUrl}GetProfileImageByFileName/${profileId},${fileName}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAllImagesForProfile(profileIds: string[]): Observable<CurrentUser> {
    return this.http.post(`${this.settings.artemisUrl}DeleteAllImagesForProfile`, profileIds, { headers: this.headers })
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
