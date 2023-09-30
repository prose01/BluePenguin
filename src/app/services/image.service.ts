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

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.artemisUrl}UploadImage`, formData, {
      observe: 'events'
    });
  }

  deleteImagesForCurrentUser(imageIds: string[]): Observable<{}> {
    return this.http.post<string[]>(`${this.artemisUrl}DeleteImagesForCurrentUser`, imageIds, { headers: this.headers });
  }

  deleteAllImagesForCurrentUser(): Observable<{}> {
    return this.http.post(`${this.artemisUrl}DeleteAllImagesForCurrentUser`, { headers: this.headers });
  }

  deleteAllImagesForProfiles(profileIds: string[]): Observable<{}> {
    return this.http.post<string[]>(`${this.artemisUrl}DeleteAllImagesForProfiles`, profileIds, { headers: this.headers });
  }
}
