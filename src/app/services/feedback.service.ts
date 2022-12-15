import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Feedback } from '../models/feedback';
import { FeedbackFilter } from '../models/feedbackFilter';
import { ConfigurationLoader } from "../configuration/configuration-loader.service";

@Injectable({
  providedIn: 'root'
})
export class FeedBackService {

  private avalonUrl: string;
  private headers: HttpHeaders;

  constructor(private configurationLoader: ConfigurationLoader, private http: HttpClient) {
    this.avalonUrl = this.configurationLoader.getConfiguration().avalonUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  addFeedback(feedback: Feedback): Observable<{}> {
    return this.http.post<Feedback>(`${this.avalonUrl}AddFeedback`, feedback, { headers: this.headers });
  }

  openFeedbacks(feedbackIds: String[]): Observable<{}> {
    return this.http.post<Feedback>(`${this.avalonUrl}OpenFeedbacks`, feedbackIds, { headers: this.headers });
  }

  closeFeedbacks(feedbackIds: String[]): Observable<{}> {
    return this.http.post<Feedback>(`${this.avalonUrl}CloseFeedbacks`, feedbackIds, { headers: this.headers });
  }

  getUnassignedFeedbacks(countrycode: string, languagecode: string): Observable<Feedback[]> {
    const params = new HttpParams()
      .set('Countrycode', countrycode)
      .set('Languagecode', languagecode);

    return this.http.get<Feedback[]>(`${this.avalonUrl}GetUnassignedFeedbacks`, { headers: this.headers, params: params });
  }

  assignFeedbackToAdmin(feedbackIds: Feedback[]): Observable<{}> {
    return this.http.post<Feedback>(`${this.avalonUrl}AssignFeedbackToAdmin`, feedbackIds, { headers: this.headers });
  }

  getFeedbacksByFilter(feedbackFilter: FeedbackFilter): Observable<Feedback[]> {
    return this.http.post<Feedback[]>(`${this.avalonUrl}GetFeedbacksByFilter`, { feedbackFilter }, { headers: this.headers });
  }
}
