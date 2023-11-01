import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ConfigurationLoader } from "../configuration/configuration-loader.service";
import { IMessageModel } from '../models/messageModel';
import { ChatFilter } from '../models/chatFilter';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private junoUrl: string;
  private headers: HttpHeaders;

  constructor(private configurationLoader: ConfigurationLoader, private http: HttpClient) {
    this.junoUrl = this.configurationLoader.getConfiguration().junoUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }


  getProfileMessages(profileId: string, pageIndex: number, pageSize: number): Observable<IMessageModel[]> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<IMessageModel[]>(`${this.junoUrl}ProfileMessages/${profileId}`, { headers: this.headers, params: params });
  }

  getChatsByFilter(chatFilter: ChatFilter, pageIndex: number, pageSize: number): Observable<IMessageModel[]> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.post<IMessageModel[]>(`${this.junoUrl}GetChatsByFilter`, { chatFilter }, { headers: this.headers, params: params });
  }

  doNotDelete(messages: IMessageModel[]): Observable<{}> {
    return this.http.post<IMessageModel[]>(`${this.junoUrl}DoNotDelete`, messages, { headers: this.headers });
  }

  allowDelete(messages: IMessageModel[]): Observable<{}> {
    return this.http.post<IMessageModel[]>(`${this.junoUrl}AllowDelete`, messages, { headers: this.headers });
  }
}
