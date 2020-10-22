import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { catchError } from 'rxjs/operators';
import { AppSettings } from "../models/appSettings";

const SETTINGS_LOCATION = "assets/appsettings.json";

@Injectable()
export class AppSettingsService {
  constructor(private http: HttpClient) {
  }

  getSettings(): Observable<AppSettings> {
    return this.http.get<AppSettings>(SETTINGS_LOCATION)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any):
    Observable<AppSettings> {

    // Log the error to the console
    switch (error.status) {
      case 404:
        console.error("Can't find file: " +
          SETTINGS_LOCATION);
        break;
      default:
        console.error(error);
        break;
    }

    // Return default configuration values
    return Observable.of<AppSettings>(
      new AppSettings());
  }
} 
