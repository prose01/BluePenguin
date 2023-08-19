import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ConfigurationLoader } from '../configuration/configuration-loader.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private artemisUrl: string;
  private headers: HttpHeaders;

  constructor(private configurationLoader: ConfigurationLoader, private http: HttpClient) {
    this.artemisUrl = this.configurationLoader.getConfiguration().artemisUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  // CurrentUser

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.artemisUrl}UploadImage`, formData, {
      observe: 'events'
    });
  }

  //getImageByFileName(fileName: string): Observable<any[]> {
  //  return this.http.get<any[]>(`${this.artemisUrl}GetImageByFileName/${fileName}`, { headers: this.headers });
  //}

  deleteImagesForCurrentUser(imageId: string[]): Observable<{}> {
    return this.http.post(`${this.artemisUrl}DeleteImagesForCurrentUser`, imageId, { headers: this.headers });
  }

  deleteAllImagesForCurrentUser(): Observable<{}> {
    return this.http.post(`${this.artemisUrl}DeleteAllImagesForCurrentUser`, { headers: this.headers });
  }

  // Profile

  //getProfileImages(profileId: string, size: ImageSizeEnum): Observable<any[]> {
  //  return this.http.get<any[]>(`${this.artemisUrl}GetProfileImages/${profileId},${size}`, { headers: this.headers });
  //}

  //getProfileImageByFileName(profileId: string, fileName: string, size: ImageSizeEnum): Observable<any[]> {
  //  return this.http.get<any[]>(`${this.artemisUrl}GetProfileImageByFileName/${profileId},${fileName},${size}`, { headers: this.headers });
  //}

  deleteAllImagesForProfiles(profileIds: string[]): Observable<{}> {
    return this.http.post(`${this.artemisUrl}DeleteAllImagesForProfiles`, profileIds, { headers: this.headers });
  }
}
